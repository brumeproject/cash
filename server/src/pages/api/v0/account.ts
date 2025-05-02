// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { supabase } from "@/mods/supabase/mods/client";
import { ZeroHexString } from "@hazae41/hex";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function account(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const headers = new Headers({ "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "POST", "Access-Control-Allow-Headers": "Content-Type" })

  if (req.method === "OPTIONS")
    return void res.status(200).setHeaders(headers).end()
  if (req.method !== "GET")
    return void res.status(405).setHeaders(headers).end()
  if (req.url == null)
    return void res.status(400).setHeaders(headers).end()

  const url = new URL(req.url, "http://example.com")

  const $address = url.searchParams.get("address")

  if ($address == null)
    return void res.status(400).setHeaders(headers).end()
  if (!ZeroHexString.Length.is($address, 20))
    return void res.status(400).setHeaders(headers).end()

  const address = $address.toLowerCase()

  const { data, error } = await supabase
    .from("accounts")
    .select("*")
    .eq("address", address)
    .limit(1)

  if (error != null)
    throw new Error("Database error", { cause: error.message })

  const [account = { address, balance: "0", nonce: "0" }] = data

  res.status(200).setHeaders(headers).json(account);
}
