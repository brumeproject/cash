// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "@/mods/supabase/mods/client";
import { CashServerWasm } from "@brumewallet/cash.server.wasm";
import { z } from "@hazae41/gardien";
import type { NextApiRequest, NextApiResponse } from "next";

await CashServerWasm.initBundled()

/* 
create or replace function generate(
    version text,
    address text,
    nonce numeric,
    signature text,
    receiver text,
    secrets text,
    sparks numeric
) returns numeric as $$
declare
    previous record;
    delta numeric;
    psparks numeric;
    ptokens numeric;
    bsparks numeric;
    ssparks numeric;
    btokens numeric;
    stokens numeric;
    tokens numeric;
begin
    if exists (
        select 1 
        from accounts 
        where accounts.address = generate.address
        and accounts.nonce::numeric != generate.nonce
    ) then
        raise exception 'Invalid nonce';
    end if;

    select * into previous from events where type = 'generate' order by id desc limit 1;

    delta := extract(epoch from (select current_timestamp)) - extract(epoch from (coalesce(previous.time, (select current_timestamp))));

    psparks := coalesce((previous.data -> 'psparks')::numeric, 1);
    ptokens := coalesce((previous.data -> 'ptokens')::numeric, 1);

    stokens := delta / 100;
    ptokens = ptokens + stokens;

    ssparks := least(sparks, psparks);
    btokens := (ssparks * ptokens) / (psparks + ssparks);

    psparks = psparks + ssparks;
    ptokens = ptokens - btokens;

    tokens := btokens;

    insert into accounts (address, balance, nonce)
    values (generate.receiver, to_jsonb(tokens), to_jsonb(0))
    on conflict on constraint accounts_pkey
    do update set balance = to_jsonb(accounts.balance::numeric + tokens);

    insert into accounts (address, balance, nonce)
    values (generate.address, to_jsonb(0), to_jsonb(1))
    on conflict on constraint accounts_pkey
    do update set nonce = to_jsonb(accounts.nonce::numeric + 1);

    insert into events (type, data)
    values ('generate', jsonb_build_object('version', generate.version, 'address', generate.address, 'nonce', generate.nonce, 'signature', generate.signature, 'receiver', generate.receiver, 'secrets', generate.secrets, 'sparks', generate.sparks, 'tokens', tokens, 'psparks', psparks, 'ptokens', ptokens));
    
    return tokens;
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

  using publicKeyHashMemory = CashServerWasm.keccak256(publicKeyMemory)
  const publicKeyHashBase16 = CashServerWasm.base16_encode_lower(publicKeyHashMemory)

  return `0x${publicKeyHashBase16.slice(24)}`
}

function hashOrThrow(text: string) {
  const textString = text
  const textBytes = new TextEncoder().encode(textString)
  using textMemory = new CashServerWasm.Memory(textBytes)

  using hashMemory = CashServerWasm.keccak256(textMemory)
  const hashZeroHex = `0x${CashServerWasm.base16_encode_lower(hashMemory)}`

  return hashZeroHex
}

export default async function generate(
  req: NextApiRequest,
  res: NextApiResponse,
) {
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
  if ($secrets.length > (2 + (64 * 2048)))
    return void res.status(400).setHeaders(headers).end()

  const version = $version
  const type = $type
  const nonce = $nonce
  const receiver = $receiver
  const secrets = $secrets
  const data = { receiver, secrets }

  const message = JSON.stringify({ version, type, nonce, data })
  const signature = $signature

  const address = recoverOrThrow(message, signature)
  const hash = hashOrThrow(JSON.stringify({ message, signature }))

  {
    const versionBigInt = BigInt($version)
    const versionBase16 = versionBigInt.toString(16).padStart(64, "0")
    using versionMemory = CashServerWasm.base16_decode_mixed(versionBase16)

    const nonceBigInt = BigInt($nonce)
    const nonceBase16 = nonceBigInt.toString(16).slice(2).padStart(64, "0")
    using nonceMemory = CashServerWasm.base16_decode_mixed(nonceBase16)

    const addressZeroHex = address
    const addressBase16 = addressZeroHex.slice(2).padStart(64, "0")
    using addressMemory = CashServerWasm.base16_decode_mixed(addressBase16)

    using mixinWasm = new CashServerWasm.NetworkMixin(versionMemory, addressMemory, nonceMemory)

    const secretsBase16 = $secrets.slice(2)
    using secretsMemory = CashServerWasm.base16_decode_mixed(secretsBase16)

    using valueMemory = mixinWasm.verify_secrets(secretsMemory)
    const valueZeroHex = `0x${CashServerWasm.base16_encode_lower(valueMemory)}`
    const valueBigInt = BigInt(valueZeroHex)
    const valueString = valueBigInt.toString()

    {
      const receiver = $receiver.toLowerCase()
      const sparks = valueString

      const { data, error } = await supabase.rpc("generate", { version, address, nonce, signature, hash, receiver, secrets, sparks })

      if (error != null)
        throw new Error("Database error", { cause: error.message })

      res.status(200).setHeaders(headers).json(data);
    }
  }

}
