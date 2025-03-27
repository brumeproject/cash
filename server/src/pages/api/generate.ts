// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Database } from "@/mods/supabase";
import { CashServerWasm } from "@brumewallet/cash.server.wasm";
import { z } from "@hazae41/gardien";
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { recoverMessageAddress } from "viem";

const supabase = createClient<Database>("https://vqceovbkcavejkqyqbqd.supabase.co", process.env.SUPABASE_KEY!)

/* 
create or replace function generate(
    address text,
    value numeric,
    count numeric,
    nonce text,
    secrets text
) returns numeric as $$
declare
    total_value numeric;
    total_count numeric;
    average numeric;
    derived numeric;
begin
    if exists (
        select 1 
        from events 
        where events.type = 'generate'
        and events.data ->> address = generate.address 
        and events.data ->> nonce = generate.nonce
    ) then
        raise exception 'Nonce replayed';
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

    insert into accounts (address, balance)
    values (generate.address, to_jsonb(derived))
    on conflict on constraint accounts_pkey
    do update set
        balance = to_jsonb(accounts.balance::numeric + derived);

    insert into events (type, data)
    values ('generate', jsonb_build_object('address', generate.address, 'value', generate.value, 'count', generate.count, 'nonce', generate.nonce, 'secrets', generate.secrets));
    
    return derived;
end;
$$ language plpgsql;
*/

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const headers = new Headers({ "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" })

  if (req.method === "OPTIONS")
    return void res.status(200).setHeaders(headers).end()
  if (req.method !== "POST")
    return void res.status(405).setHeaders(headers).end()

  const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A"
  const nonceZeroHex = z.string().asOrThrow(req.body.nonceZeroHex).toLowerCase()
  const secretsZeroHex = z.string().asOrThrow(req.body.secretsZeroHex).toLowerCase()
  const signatureZeroHex = z.string().asOrThrow(req.body.signatureZeroHex).toLowerCase()

  if (secretsZeroHex.length > (2 + (64 * 2048)))
    throw new Error("Too many secrets")

  const receiverZeroHex = await recoverMessageAddress({ message: nonceZeroHex, signature: signatureZeroHex as `0x${string}` }).then(x => x.toLowerCase())

  {
    await CashServerWasm.initBundled()

    const contractBase16 = contractZeroHex.slice(2).padStart(64, "0")
    using contractMemory = CashServerWasm.base16_decode_mixed(contractBase16)

    const nonceBase16 = nonceZeroHex.slice(2).padStart(64, "0")
    using nonceMemory = CashServerWasm.base16_decode_mixed(nonceBase16)

    const receiverBase16 = receiverZeroHex.slice(2).padStart(64, "0")
    using receiverMemory = CashServerWasm.base16_decode_mixed(receiverBase16)

    using mixinWasm = new CashServerWasm.NetworkMixin(contractMemory, receiverMemory, nonceMemory)

    const secretsBase16 = secretsZeroHex.slice(2)
    using secretsMemory = CashServerWasm.base16_decode_mixed(secretsBase16)

    using valueMemory = mixinWasm.verify_secrets(secretsMemory)
    const valueRawHex = CashServerWasm.base16_encode_lower(valueMemory)
    const valueZeroHex = `0x${valueRawHex}`
    const valueBigInt = BigInt(valueZeroHex)

    {
      const countNumber = (secretsZeroHex.length - 2) / 64
      const countString = countNumber.toString()

      const address = receiverZeroHex
      const value = valueBigInt.toString()
      const count = countString
      const nonce = nonceZeroHex
      const secrets = secretsZeroHex

      const { data, error } = await supabase.rpc("generate", { address, value, count, nonce, secrets })

      if (error != null)
        throw new Error("Database error", { cause: error.message })

      res.status(200).setHeaders(headers).json(data);
    }
  }
}
