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
  const params = z.any().asOrThrow(req.body.params)

  if (method === "eth_chainId") {
    const response = { jsonrpc: "2.0", id, result: "0x6272756d65" }
    return void res.status(200).setHeaders(headers).json(response);
  }

  if (method === "net_version") {
    const response = { jsonrpc: "2.0", id, result: "422827093349" }
    return void res.status(200).setHeaders(headers).json(response);
  }

  if (method === "eth_blockNumber") {
    const response = { jsonrpc: "2.0", id, result: "0x1" }
    return void res.status(200).setHeaders(headers).json(response);
  }

  if (method === "eth_getBalance") {
    const response = { jsonrpc: "2.0", id, result: "0x0" }
    return void res.status(200).setHeaders(headers).json(response);
  }

  if (method === "eth_getBlockByNumber") {
    const blockNumber = z.string().asOrThrow(params[0])
    const includeTransactions = z.boolean().asOrThrow(params[1])

    const result = {
      "number": blockNumber,
      "hash": "0x7f9a8b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0",
      "parentHash": "0x6e8d7c2b3a4f5e6d7c8b9a0f1e2d3c4b5a6e7f8d9c0b1a2e3f4d5c6b7a8e9f0",
      "nonce": "0x0000000000000042",
      "sha3Uncles": "0x1dcc4de8dec75d7aab85b567b6ccd41ad312451b948a7413f0a142fd40d49347",
      "logsBloom": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "transactionsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "stateRoot": "0xd7f8974fb5ac78d9ac099b9ad5018bedc2ce0a72dad1827a1709da30580f0544",
      "receiptsRoot": "0x56e81f171bcc55a6ff8345e692c0f86e5b48e01b996cadc001622fb5e363b421",
      "miner": "0x1234567890abcdef1234567890abcdef12345678",
      "difficulty": "0x4ea3f27bc",
      "totalDifficulty": "0xc8709f4e9b2a",
      "extraData": "0x",
      "size": "0x027f07",
      "gasLimit": "0x7a1200",
      "gasUsed": "0x3d0900",
      "timestamp": "0x63f9a8bc",
      "transactions": [],
      "uncles": []
    }

    const response = { jsonrpc: "2.0", id, result }
    return void res.status(200).setHeaders(headers).json(response);
  }

  res.status(400).setHeaders(headers).end();
}
