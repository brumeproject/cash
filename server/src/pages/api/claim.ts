// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from "@hazae41/gardien";
import { NetWorker } from "@hazae41/networker";
import type { NextApiRequest, NextApiResponse } from "next";

using worker = new NetWorker()

const chainIdString = "1"
const contractZeroHex = "0xabc755011B810fDC31F3504f0F855cadFcb2685A"

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const totalValueBigIntSlot = { current: 0n }

  const nonceZeroHex = z.string().asOrThrow(req.body.nonceZeroHex)
  const receiverZeroHex = z.string().asOrThrow(req.body.receiverZeroHex)

  // TODO: add authentication to avoid various attacks with nonce

  // TODO: verify database if nonce is not replayed

  await using mixin = await worker.createOrThrow({ chainIdString, contractZeroHex, receiverZeroHex, nonceZeroHex })

  const secretsZeroHexArray = z.array(z.string()).asOrThrow(req.body.secretsZeroHexArray)

  for (const secretZeroHex of secretsZeroHexArray) {
    const secretValueZeroHex = await mixin.verifySecretOrThrow(secretZeroHex)
    const secretValueBigInt = BigInt(secretValueZeroHex)

    totalValueBigIntSlot.current += secretValueBigInt
  }

  const totalValueZeroHex = totalValueBigIntSlot.current.toString(16)

  res.status(200).json({ totalValueZeroHex });
}
