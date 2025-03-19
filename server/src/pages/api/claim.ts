// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Database } from "@/mods/supabase";
import { CashServerWasm } from "@brumewallet/cash.server.wasm";
import { z } from "@hazae41/gardien";
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient<Database>("https://nqxmcclvbwhioxcrhtaz.supabase.co", process.env.SUPABASE_KEY!)

const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await CashServerWasm.initBundled()

  const nonceZeroHex = z.string().asOrThrow(req.body.nonceZeroHex)
  const receiverZeroHex = z.string().asOrThrow(req.body.receiverZeroHex).toLowerCase()
  const signatureZeroHex = z.string().asOrThrow(req.body.signatureZeroHex).toLowerCase()
  const secretsZeroHexArray = z.array(z.string()).asOrThrow(req.body.secretsZeroHexArray)

  using nonceMemory = CashServerWasm.base16_decode_mixed(nonceZeroHex.slice(2))

  const nonceHashBytes = new Uint8Array(await crypto.subtle.digest("SHA-256", nonceMemory.bytes))
  using nonceHashMemory = new CashServerWasm.Memory(nonceHashBytes)

  using signatureMemory = CashServerWasm.base16_decode_mixed(signatureZeroHex.slice(2))
  using signatureWasm = CashServerWasm.Secp256k1SignatureAndRecovery.from_bytes(signatureMemory)

  using pubkeyWasm = CashServerWasm.Secp256k1VerifyingKey.recover_from_prehash(nonceHashMemory, signatureWasm)
  using pubkeyMemory = pubkeyWasm.to_sec1_uncompressed_bytes()

  using pubkeyHashMemory = CashServerWasm.keccak256(pubkeyMemory)
  const pubkeyHashRawHex = CashServerWasm.base16_encode_lower(pubkeyHashMemory)

  const addressRawHex = pubkeyHashRawHex.slice(-40)
  const addressZeroHex = `0x${addressRawHex}`

  if (addressZeroHex !== receiverZeroHex)
    throw new Error("Invalid signature")

  // TODO: verify database if nonce is not replayed
  const { data, error } = await supabase
    .from("mints")
    .select("*")
    .limit(1)
    .eq("nonce", "given_nonce")
    .eq("receiver", "given_address")

  if (error != null)
    throw new Error("Database error")

  if (data.length > 0)
    throw new Error("Nonce replayed")


  new CashServerWasm.NetworkMixin()

  // TODO: remove chain id
  // await using mixin = await worker.createOrThrow({ contractZeroHex, receiverZeroHex, nonceZeroHex })

  // const totalValueZeroHex = await mixin.verifySecretsOrThrow(secretsZeroHexArray)

  // res.status(200).json({ totalValueZeroHex });
}
