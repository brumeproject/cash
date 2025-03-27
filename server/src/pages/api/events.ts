// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { Database } from "@/mods/supabase";
import { createClient } from "@supabase/supabase-js";
import type { NextApiRequest, NextApiResponse } from "next";

const supabase = createClient<Database>("https://vqceovbkcavejkqyqbqd.supabase.co", process.env.SUPABASE_KEY!)

export default async function handler(
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

  const limit = url.searchParams.get("limit")
  const offset = url.searchParams.get("offset")

  if (limit == null)
    return void res.status(400).setHeaders(headers).end()
  if (offset == null)
    return void res.status(400).setHeaders(headers).end()

  const limitString = limit
  const limitNumber = Number(limitString)

  const offsetString = offset
  const offsetNumber = Number(offsetString)

  const absoluteOffsetNumber = offsetNumber < 0 ? ((-offsetNumber) - 1) : offsetNumber

  const { data, error } = await supabase.from("events").select("*")
    .order("id", { ascending: (offsetNumber >= 0) })
    .range(absoluteOffsetNumber, absoluteOffsetNumber + limitNumber - 1)

  if (error != null)
    throw new Error("Database error", { cause: error.message })

  res.status(200).setHeaders(headers).json(data);
}
