// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "@/mods/supabase/mods/client";
import { CashServerWasm } from "@brumewallet/cash.server.wasm";
import { z } from "@hazae41/gardien";
import type { NextApiRequest, NextApiResponse } from "next";
import { recoverMessageAddress } from "viem";

/* 
create or replace function generate(
    version text,
    address text,
    nonce numeric,
    signature text,
    receiver text,
    secrets text,
    value numeric,
    count numeric
) returns numeric as $$
declare
    total_value numeric;
    total_count numeric;
    average numeric;
    derived numeric;
begin
    if exists (
        select 1 
        from accounts 
        where accounts.address = generate.address
        and accounts.nonce != generate.nonce
    ) then
        raise exception 'Invalid nonce';
    end if;

    total_value := coalesce((select meta.value::numeric from meta where key = 'total_value'), 0) + generate.value;
    total_count := coalesce((select meta.value::numeric from meta where key = 'total_count'), 0) + generate.count;

    insert into meta (key, value)
    values ('total_value', to_jsonb(total_value))
    on conflict on constraint meta_pkey
    do update set value = to_jsonb(total_value);

    insert into meta (key, value)
    values ('total_count', to_jsonb(total_count))
    on conflict on constraint meta_pkey
    do update set value = to_jsonb(total_count);

    average := total_value / total_count;
    derived := generate.value / average;

    insert into accounts (address, balance, nonce)
    values (generate.receiver, to_jsonb(derived), to_jsonb(0))
    on conflict on constraint accounts_pkey
    do update set balance = to_jsonb(accounts.balance::numeric + derived);

    insert into accounts (address, balance, nonce)
    values (generate.address, to_jsonb(0), to_jsonb(1))
    on conflict on constraint accounts_pkey
    do update set nonce = to_jsonb(accounts.nonce::numeric + 1);

    insert into events (type, data)
    values ('generate', jsonb_build_object('version', generate.version, 'address', generate.address, 'nonce', generate.nonce, 'signature', generate.signature, 'receiver', generate.receiver, 'secrets', generate.secrets, 'value', generate.value, 'count', generate.count, 'average', average, 'derived', derived));
    
    return derived;
end;
$$ language plpgsql;
*/

export default async function generate(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const headers = new Headers({ "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" })

  if (req.method === "OPTIONS")
    return void res.status(200).setHeaders(headers).end()
  if (req.method !== "POST")
    return void res.status(405).setHeaders(headers).end()

  const typeZeroHex = "0x67656e6572617465".toLowerCase()
  const versionZeroHex = "0x6272756d65".toLowerCase()

  const nonceZeroHex = z.string().asOrThrow(req.body.nonceZeroHex).toLowerCase()
  const receiverZeroHex = z.string().asOrThrow(req.body.receiverZeroHex).toLowerCase()
  const secretsZeroHex = z.string().asOrThrow(req.body.secretsZeroHex).toLowerCase()
  const signatureZeroHex = z.string().asOrThrow(req.body.signatureZeroHex).toLowerCase()

  if (secretsZeroHex.length > (2 + (64 * 2048)))
    throw new Error("Too many secrets")

  const version = versionZeroHex
  const nonce = nonceZeroHex
  const type = typeZeroHex
  const receiver = receiverZeroHex
  const secrets = secretsZeroHex
  const data = { receiver, secrets }

  const signature = signatureZeroHex as `0x${string}`
  const message = JSON.stringify({ version, type, nonce, data })
  const address = await recoverMessageAddress({ message, signature })

  {
    await CashServerWasm.initBundled()

    const versionBase16 = versionZeroHex.slice(2).padStart(64, "0")
    using versionMemory = CashServerWasm.base16_decode_mixed(versionBase16)

    const nonceBase16 = nonceZeroHex.slice(2).padStart(64, "0")
    using nonceMemory = CashServerWasm.base16_decode_mixed(nonceBase16)

    const addressZeroHex = address.toLowerCase()
    const addressBase16 = addressZeroHex.slice(2).padStart(64, "0")
    using addressMemory = CashServerWasm.base16_decode_mixed(addressBase16)

    using mixinWasm = new CashServerWasm.NetworkMixin(versionMemory, addressMemory, nonceMemory)

    const secretsBase16 = secretsZeroHex.slice(2)
    using secretsMemory = CashServerWasm.base16_decode_mixed(secretsBase16)

    using valueMemory = mixinWasm.verify_secrets(secretsMemory)
    const valueRawHex = CashServerWasm.base16_encode_lower(valueMemory)
    const valueZeroHex = `0x${valueRawHex}`

    {
      const countNumber = (secretsZeroHex.length - 2) / 64
      const countString = countNumber.toString()

      const valueBigInt = BigInt(valueZeroHex)
      const valueString = valueBigInt.toString()

      const nonceBigIng = BigInt(nonceZeroHex)
      const nonceString = nonceBigIng.toString()

      const version = versionZeroHex
      const address = addressZeroHex
      const nonce = nonceString
      const signature = signatureZeroHex
      const receiver = receiverZeroHex
      const secrets = secretsZeroHex
      const value = valueString
      const count = countString

      const { data, error } = await supabase.rpc("generate", { version, address, nonce, signature, receiver, secrets, value, count })

      if (error != null)
        throw new Error("Database error", { cause: error.message })

      res.status(200).setHeaders(headers).json(data);
    }
  }

}
