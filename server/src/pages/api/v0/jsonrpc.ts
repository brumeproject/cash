// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { z } from "@hazae41/gardien";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function jsonrpc(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const headers = new Headers({ "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" })

  if (req.method === "OPTIONS")
    return void res.status(200).setHeaders(headers).end()
  if (req.method !== "POST")
    return void res.status(405).setHeaders(headers).end()

  const id = z.unknown().asOrThrow(req.body.id)
  const method = z.string().asOrThrow(req.body.method)
  const params = z.unknown().asOrThrow(req.body.params)

  if (method === "eth_chainId") {
    const data = { jsonrpc: "2.0", id, result: "0x6272756d65" }
    return void res.status(200).setHeaders(headers).json(data);
  }

  if (method === "net_version") {
    const data = { jsonrpc: "2.0", id, result: "422827093349" }
    return void res.status(200).setHeaders(headers).json(data);
  }

  if (method === "eth_blockNumber") {
    const data = { jsonrpc: "2.0", id, result: "0x1" }
    return void res.status(200).setHeaders(headers).json(data);
  }

  if (method === "eth_getBalance") {
    const data = { jsonrpc: "2.0", id, result: "0x0" }
    return void res.status(200).setHeaders(headers).json(data);
  }

  res.status(400).setHeaders(headers).end();
}
