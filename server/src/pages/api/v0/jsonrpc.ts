// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "@/mods/supabase/mods/client";
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
    const response = { jsonrpc: "2.0", id, result: `0x${Date.now().toString(16)}` }
    return void res.status(200).setHeaders(headers).json(response);
  }

  if (method === "eth_getBalance") {
    const address = z.string().asOrThrow(params[0]).toLowerCase()

    const { data, error } = await supabase
      .from("accounts")
      .select("balance")
      .eq("address", address)
      .limit(1)

    if (error)
      throw new Error("Database error", { cause: error.message })

    const [account = { address, balance: "0", nonce: "0" }] = data

    const result = `0x${BigInt(account.balance).toString(16)}`

    const response = { jsonrpc: "2.0", id, result }
    return void res.status(200).setHeaders(headers).json(response);
  }

  if (method === "eth_getBlockByNumber") {
    const result = {
      "number": z.string().asOrThrow(params[0]),
      "hash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "parentHash": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "nonce": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "sha3Uncles": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "logsBloom": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "transactionsRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "stateRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "receiptsRoot": "0x0000000000000000000000000000000000000000000000000000000000000000",
      "miner": "0x0000000000000000000000000000000000000000",
      "difficulty": "0x0",
      "totalDifficulty": "0x0",
      "extraData": "0x",
      "size": "0x0",
      "gasLimit": "0x0",
      "gasUsed": "0x0",
      "timestamp": "0x0",
      "transactions": [],
      "uncles": []
    }

    const response = { jsonrpc: "2.0", id, result }
    return void res.status(200).setHeaders(headers).json(response);
  }

  res.status(400).setHeaders(headers).end();
}
