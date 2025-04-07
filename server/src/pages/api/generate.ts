// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import generate from "./v0/generate";

// TODO: delete this file when all clients are updated
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await generate(req, res)
}
