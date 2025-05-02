// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "@/mods/supabase/mods/client";
import { CashServerWasm } from "@brumewallet/cash.server.wasm";
import { z } from "@hazae41/gardien";
import { ZeroHexString } from "@hazae41/hex";
import type { NextApiRequest, NextApiResponse } from "next";

/* 
create or replace function generate(
    version text,
    address text,
    nonce text,
    signature text,
    receiver text,
    secrets text,
    sparks text
) returns numeric as $$
declare
    _sparks numeric;
    _tokens numeric;

    _revent record;
    _rnonce record;
    _rbalance record;
    _rgenerate record;

    _delta numeric;

    _psparks numeric;
    _ptokens numeric;
    _bsparks numeric;
    _ssparks numeric;
    _btokens numeric;
    _stokens numeric;

    _fnonce text;
    _fbalance text;

    _data jsonb;
begin
    _sparks := sparks::numeric;
    
    if exists (
        select 1 from accounts 
        where accounts.address = generate.address
        and accounts.nonce != generate.nonce
    ) then
        raise exception 'Invalid nonce';
    end if;

    select *  into _revent from events
    order by time desc limit 1;

    select * into _rnonce from events
    where events.data @> format('{"events": [{"type": "nonce", "address": "%s"}]}', generate.address)::jsonb
    order by time desc limit 1;

    select * into _rbalance from events
    where events.data @> format('{"events": [{"type": "balance", "address": "%s"}]}', generate.receiver)::jsonb
    order by time desc limit 1;

    select * into _rgenerate from events
    where events.data @> '{"events": [{"type": "generate"}]}'
    order by time desc limit 1;

    _delta := extract(epoch from (select current_timestamp)) - extract(epoch from (coalesce(_rgenerate.time, (select current_timestamp))));

    _psparks := coalesce((jsonb_path_query_first(_rgenerate.data, '$.events[*] ? (@.type == "generate").psparks') #>> '{}')::numeric, 1);
    _ptokens := coalesce((jsonb_path_query_first(_rgenerate.data, '$.events[*] ? (@.type == "generate").ptokens') #>> '{}')::numeric, 1);

    _stokens := _delta * power(10, 16);
    _ptokens = _ptokens + _stokens;

    _ssparks := least(_sparks, _psparks);
    _btokens := floor((_ssparks * _ptokens) / (_psparks + _ssparks));

    _psparks = _psparks + _ssparks;
    _ptokens = _ptokens - _btokens;

    _tokens := _btokens;

    insert into accounts (address, balance, nonce)
    values (generate.address, 0::text, 1::text)
    on conflict on constraint accounts_pkey do update set 
    nonce = (accounts.nonce::numeric + 1)::text;

    insert into accounts (address, balance, nonce)
    values (generate.receiver, _tokens::text, 0::text)
    on conflict on constraint accounts_pkey do update set
    balance = (accounts.balance::numeric + _tokens)::text;

    select accounts.nonce into _fnonce from accounts 
    where accounts.address = generate.address;

    select accounts.balance into _fbalance from accounts 
    where accounts.address = generate.receiver;

    _data := jsonb_build_object(
        'parent', jsonb_build_object(
            'id', _revent.id::text,
            'hash', _revent.hash::text
        ),
        'intent', jsonb_build_object(
            'method', 'generate', 
            'version', generate.version::text, 
            'nonce', generate.nonce::text, 
            'address', generate.address::text, 
            'signature', generate.signature::text,
            'params', jsonb_build_object(
                'receiver', generate.receiver::text, 
                'secrets', generate.secrets::text
            )
        ),
        'events', jsonb_build_array(
            jsonb_build_object(
                'type', 'nonce',
                'address', generate.address::text,
                'value', _fnonce::text,
                'parent', jsonb_build_object(
                    'id', _rnonce.id::text, 
                    'hash', _rnonce.hash::text
                )
            ),
            jsonb_build_object(
                'type', 'balance',
                'address', generate.receiver::text,
                'value', _fbalance::text,
                'parent', jsonb_build_object(
                    'id', _rbalance.id::text, 
                    'hash', _rbalance.hash::text
                )
            ),
            jsonb_build_object(
                'type', 'generate',
                'sender', generate.address::text,
                'receiver', generate.receiver::text,
                'sparks', sparks::text,
                'tokens', _tokens::text,
                'psparks', _psparks::text,
                'ptokens', _ptokens::text,
                'parent', jsonb_build_object(
                    'id', _rgenerate.id::text, 
                    'hash', _rgenerate.hash::text
                )
            )
        )
    );

    insert into events (data, hash)
    values (_data, hashtext(_data::text)::text);
    
    return _tokens::text;
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
  const $secrets = z.string().asOrThrow(req.body.secrets)
  const $signature = z.string().asOrThrow(req.body.signature)

  if ($version !== "422827093349")
    return void res.status(400).setHeaders(headers).end()
  if ($type !== "generate")
    return void res.status(400).setHeaders(headers).end()
  if (!ZeroHexString.Length.is($receiver, 20))
    return void res.status(400).setHeaders(headers).end()
  if (!ZeroHexString.is($secrets))
    return void res.status(400).setHeaders(headers).end()
  if ($secrets.length > (2 + (64 * 2048)))
    return void res.status(400).setHeaders(headers).end()

  const [version, type] = [$version, $type]

  const receiver = $receiver.toLowerCase()
  const secrets = $secrets.toLowerCase()
  const data = { receiver, secrets }

  const nonce = BigInt($nonce).toString()

  const signature = $signature as `0x${string}`
  const message = JSON.stringify({ version, type, nonce, data })
  const signer = recoverOrThrow(message, signature)

  {
    const versionBigInt = BigInt($version)
    const versionBase16 = versionBigInt.toString(16).padStart(64, "0")
    using versionMemory = CashServerWasm.base16_decode_mixed(versionBase16)

    const nonceBigInt = BigInt($nonce)
    const nonceBase16 = nonceBigInt.toString(16).slice(2).padStart(64, "0")
    using nonceMemory = CashServerWasm.base16_decode_mixed(nonceBase16)

    const signerZeroHex = signer.toLowerCase()
    const signerBase16 = signerZeroHex.slice(2).padStart(64, "0")
    using signerMemory = CashServerWasm.base16_decode_mixed(signerBase16)

    using mixinWasm = new CashServerWasm.NetworkMixin(versionMemory, signerMemory, nonceMemory)

    const secretsBase16 = $secrets.slice(2)
    using secretsMemory = CashServerWasm.base16_decode_mixed(secretsBase16)

    using valueMemory = mixinWasm.verify_secrets(secretsMemory)
    const valueRawHex = CashServerWasm.base16_encode_lower(valueMemory)
    const valueZeroHex = `0x${valueRawHex}`
    const valueBigInt = BigInt(valueZeroHex)

    {
      const address = signer.toLowerCase()
      const receiver = $receiver.toLowerCase()
      const sparks = valueBigInt.toString()

      const { data, error } = await supabase.rpc("generate", { version, address, nonce, signature, receiver, secrets, sparks })

      if (error != null)
        throw new Error("Database error", { cause: error.message })

      res.status(200).setHeaders(headers).json(data);
    }
  }

}
