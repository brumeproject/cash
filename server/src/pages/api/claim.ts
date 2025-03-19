// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Database } from "@/mods/supabase";
import { CashServerWasm } from "@brumewallet/cash.server.wasm";
import { z } from "@hazae41/gardien";
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";
import { recoverMessageAddress } from "viem";

await CashServerWasm.initBundled()

const supabase = createClient<Database>("https://nqxmcclvbwhioxcrhtaz.supabase.co", process.env.SUPABASE_KEY!)

const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A"
using contractMemory = CashServerWasm.base16_decode_mixed(contractZeroHex.slice(2))

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const nonceZeroHex = z.string().asOrThrow(req.body.nonceZeroHex).toLowerCase()
  const secretsZeroHex = z.string().asOrThrow(req.body.secretsZeroHex).toLowerCase()
  const signatureZeroHex = z.string().asOrThrow(req.body.signatureZeroHex).toLowerCase()

  const receiverZeroHex = await recoverMessageAddress({ message: nonceZeroHex, signature: signatureZeroHex as `0x${string}` }).then(x => x.toLowerCase())

  const { data, error } = await supabase
    .from("mints")
    .select("*")
    .limit(1)
    .eq("nonce", nonceZeroHex)
    .eq("receiver", receiverZeroHex)

  if (error != null)
    throw new Error("Database error")

  if (data.length > 0)
    throw new Error("Nonce replayed")

  using nonceMemory = CashServerWasm.base16_decode_mixed(nonceZeroHex.slice(2))
  using receiverMemory = CashServerWasm.base16_decode_mixed(receiverZeroHex.slice(2))
  using secretsMemory = CashServerWasm.base16_decode_mixed(secretsZeroHex.slice(2))

  using mixinWasm = new CashServerWasm.NetworkMixin(contractMemory, receiverMemory, nonceMemory)

  using valueMemory = mixinWasm.verify_secrets(secretsMemory)
  const valueRawHex = CashServerWasm.base16_encode_lower(valueMemory)
  const valueZeroHex = `0x${valueRawHex}`
  const valueBigInt = BigInt(valueZeroHex)

  {
    const receiver = receiverZeroHex
    const amount = valueBigInt.toString()
    const nonce = nonceZeroHex
    const secrets = secretsZeroHex

    const row = { receiver, amount, nonce, secrets }

    const { error } = await supabase
      .from("mints")
      .insert(row)

    if (error != null)
      throw new Error("Database error")

    res.status(200).json(valueZeroHex);
  }
}
