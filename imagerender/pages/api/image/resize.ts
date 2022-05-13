import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import pngToIco from "png-to-ico";
import { IncomingForm, Fields, Files, File } from "formidable";
import sharp from "sharp";
import { FormatInput, FormatType } from "../../../model/Image.model";
import {
  convertStringDataToObject,
  parseImageProcessData,
} from "../../../utils/image";
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

async function convertICO(buffer: Buffer) {
  return await pngToIco(buffer);
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
          await parseImageProcessData(sharpItem, fields);
          let buffer = await sharpItem.toBuffer();
          const object = convertStringDataToObject(fields["format"] as string);
          if (object["format"] === FormatType.ICO) {
            buffer = await convertICO(buffer);
          }
          const stream = Readable.from(buffer);
          stream.pipe(res);
        } else {
          res.status(400).json({ data: "multi file not supported" });
        }
      } catch (e) {
        console.log(e);
        res.status(500).json({ data: "something gone wrong" });
      }
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
      break;
  }
}
