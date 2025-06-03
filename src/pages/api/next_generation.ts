import { readFile } from "fs/promises";
import { NextApiRequest, NextApiResponse } from "next";
import * as path from "path";

const generationPromise = readFile(path.join(process.cwd(), "generation"))
  .then((g) => Number(g.toString("utf8")))
  .catch(() => 0);

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "GET") {
    res.status(404).end();
    return;
  }

  const generation = await generationPromise;
  res.status(200).send(generation + 1);
}
