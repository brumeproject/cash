// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "@/mods/supabase/mods/client";
import { CashServerWasm } from "@brumewallet/cash.server.wasm";
import { z } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hex";
import type { NextApiRequest, NextApiResponse } from "next";

/* 
create or replace function transfer(
    version text,
    address text,
    nonce text,
    signature text,
    receiver text,
    value text
) returns void as $$
declare
    _value numeric;

    _revent record;
    _rnonce record;
    _rbalance0 record;
    _rbalance1 record;
    _rtransfer record;

    _fnonce numeric;
    _fbalance0 numeric;
    _fbalance1 numeric;

    _data jsonb;
begin
    _value := floor(value::numeric);

    if exists (
        select 1 from accounts 
        where accounts.address = transfer.address
        and accounts.nonce != transfer.nonce
    ) then
        raise exception 'Invalid nonce';
    end if;

    if coalesce((select balance::numeric from accounts where accounts.address = transfer.address), 0) < _value then
        raise exception 'Invalid balance';
    end if;

    select *  into _revent from events
    order by time desc limit 1;

    select * into _rnonce from events
    where events.data @> format('{"events": [{"type": "nonce", "address": "%s"}]}', transfer.address)::jsonb
    order by time desc limit 1;

    select * into _rbalance0 from events
    where events.data @> format('{"events": [{"type": "balance", "address": "%s"}]}', transfer.address)::jsonb
    order by time desc limit 1;

    select * into _rbalance1 from events
    where events.data @> format('{"events": [{"type": "balance", "address": "%s"}]}', transfer.address)::jsonb
    order by time desc limit 1;

    select * into _rtransfer from events
    where events.data @> '{"events": [{"type": "transfer"}]}'
    order by time desc limit 1;

    update accounts set 
    nonce = (accounts.nonce::numeric + 1)::text,
    balance = (accounts.balance::numeric - _value)::text
    where accounts.address = transfer.address;

    insert into accounts (address, balance, nonce)
    values (transfer.receiver, _value::text, 0::text)
    on conflict on constraint accounts_pkey do update set 
    balance = (accounts.balance::numeric + _value)::text;

    select accounts.nonce::numeric into _fnonce from accounts 
    where accounts.address = transfer.address;

    select accounts.balance::numeric into _fbalance0 from accounts 
    where accounts.address = transfer.address;

    select accounts.balance::numeric into _fbalance1 from accounts 
    where accounts.address = transfer.receiver;

    _data := jsonb_build_object(
        'parent', jsonb_build_object(
            'id', _revent.id::text,
            'hash', _revent.hash::text
        ),
        'intent', jsonb_build_object(
            'method', 'transfer', 
            'version', transfer.version::text, 
            'nonce', transfer.nonce::text, 
            'address', transfer.address::text, 
            'signature', transfer.signature::text,
            'params', jsonb_build_object(
                'receiver', transfer.receiver::text, 
                'value', transfer.value::text
            )
        ),
        'events', jsonb_build_array(
            jsonb_build_object(
                'type', 'nonce',
                'address', transfer.address::text,
                'value', _fnonce::text,
                'parent', jsonb_build_object(
                    'id', _rnonce.id::text, 
                    'hash', _rnonce.hash::text
                )
            ),
            jsonb_build_object(
                'type', 'balance',
                'address', transfer.address::text,
                'value', _fbalance0::text,
                'parent', jsonb_build_object(
                    'id', _rbalance0.id::text, 
                    'hash', _rbalance0.hash::text
                )
            ),
            jsonb_build_object(
                'type', 'balance',
                'address', transfer.receiver::text,
                'value', _fbalance1::text,
                'parent', jsonb_build_object(
                    'id', _rbalance1.id::text, 
                    'hash', _rbalance1.hash::text
                )
            ),
            jsonb_build_object(
                'type', 'transfer',
                'sender', transfer.address::text,
                'receiver', transfer.receiver::text,
                'value', transfer.value::text,
                'parent', jsonb_build_object(
                    'id', _rtransfer.id::text, 
                    'hash', _rtransfer.hash::text
                )
            )
        )
    );

    insert into events (data, hash)
    values (_data, hashtext(_data::text)::text);
end;
$$ language plpgsql;
*/

function recoverOrThrow(message: string, signature: string) {
  const messageBytes = new TextEncoder().encode(message)
  const prefixBytes = new TextEncoder().encode("\x19Ethereum Signed Message:\n" + messageBytes.length)

  const concatBytes = new Uint8Array(prefixBytes.length + messageBytes.length)
  concatBytes.set(prefixBytes, 0)
  concatBytes.set(messageBytes, prefixBytes.length)

  using concatMemory = new CashServerWasm.Memory(concatBytes)
  using concatHashMemory = CashServerWasm.keccak256(concatMemory)

  const signatureBase16 = signature.slice(2)
  using signatureMemory = CashServerWasm.base16_decode_mixed(signatureBase16)
  using signatureObject = CashServerWasm.Secp256k1SignatureAndRecovery.from_bytes(signatureMemory)

  using publicKeyObject = CashServerWasm.Secp256k1VerifyingKey.recover_from_prehash(concatHashMemory, signatureObject)
  using publicKeyMemory = publicKeyObject.to_sec1_uncompressed_bytes()

  using rawPublicKeyMemory = new CashServerWasm.Memory(publicKeyMemory.bytes.subarray(1))

  using rawPublicKeyHashMemory = CashServerWasm.keccak256(rawPublicKeyMemory)
  const rawPublicKeyHashBase16 = CashServerWasm.base16_encode_lower(rawPublicKeyHashMemory)

  return `0x${rawPublicKeyHashBase16.slice(24)}`
}

export default async function generate(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await CashServerWasm.initBundled()

  const headers = new Headers({ "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" })

  if (req.method === "OPTIONS")
    return void res.status(200).setHeaders(headers).end()
  if (req.method !== "POST")
    return void res.status(405).setHeaders(headers).end()

  const $version = z.string().asOrThrow(req.body.version)
  const $type = z.string().asOrThrow(req.body.type)
  const $nonce = z.string().asOrThrow(req.body.nonce)
  const $receiver = z.string().asOrThrow(req.body.receiver)
  const $value = z.string().asOrThrow(req.body.value)
  const $signature = z.string().asOrThrow(req.body.signature)

  if ($version !== "422827093349")
    return void res.status(400).setHeaders(headers).end()
  if ($type !== "transfer")
    return void res.status(400).setHeaders(headers).end()
  if (!ZeroHexString.Length.is($receiver, 20))
    return void res.status(400).setHeaders(headers).end()

  const [version, type] = [$version, $type]

  const receiver = $receiver.toLowerCase()
  const value = BigInt($value).toString()
  const data = { receiver, value }

  const nonce = BigInt($nonce).toString()

  const signature = $signature as `0x${string}`
  const message = JSON.stringify({ version, type, nonce, data })
  const signer = recoverOrThrow(message, signature)

  {
    const address = signer.toLowerCase()
    const receiver = $receiver.toLowerCase()

    const { data, error } = await supabase.rpc("transfer", { version, address, nonce, signature, receiver, value })

    if (error != null)
      throw new Error("Database error", { cause: error.message })

    return void res.status(200).setHeaders(headers).json(data)
  }
}
