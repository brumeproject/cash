// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import balance from "./v0/balance";

// TODO: delete this file when all clients are updated
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await balance(req, res)
}
