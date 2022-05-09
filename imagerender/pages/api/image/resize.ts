import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import { IncomingForm, Fields, Files, File } from "formidable";
import sharp from "sharp";
import { parseImageProcessData } from "../../../utils/image";
import { Readable } from "stream";

type Data = {
  data: string;
};
type DataFields = {
  fields: Fields;
  files: Files;
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const asyncParse = (req: NextApiRequest & { [key: string]: any }) =>
  new Promise<DataFields>((resolve, reject) => {
    const form = new IncomingForm();
    form.parse(req, (err, fields, files) => {
      if (err) return reject(err);
      resolve({ fields, files });
    });
  });

function parseFileToStream(file: File) {
  let path = file["filepath"];
  let buffer = fs.readFileSync(path);
  return buffer;
}

export default async function handler(
  req: NextApiRequest & { [key: string]: any },
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      try {
        const { fields, files } = await asyncParse(req);
        if (!Array.isArray(files.file)) {
          let sharpItem = sharp(parseFileToStream(files.file));
           await parseImageProcessData(sharpItem, fields)
           const buffer =await sharpItem.toBuffer()
           const stream = Readable.from(buffer);
           stream.pipe(res)
          
        } else {
          res.status(400).json({ data: "multi file not supported" });
        }
      } catch (e) {
        console.log(e)
        res.status(500).json({ data: "something gone wrong" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
