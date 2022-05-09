import { Sharp } from "sharp";
import {
  Dimension,
  FormatInput,
  FormatType,
  Rectangle,
} from "../model/Image.model";

const resize = async (sharpItem: Sharp, size: Dimension) => {
  size &&
    size.width &&
    size.height &&
    sharpItem.resize(size.width, size.height);
};

const crop = async (sharpItem: Sharp, rectangle: Rectangle) => {
  sharpItem.extract({
    left: rectangle.left!,
    /** zero-indexed offset from top edge */
    top: rectangle.top!,
    /** dimension of extracted image */
    width: rectangle.width!,
    /** dimension of extracted image */
    height: rectangle.height!,
  });
};

const sharpen = async (sharpItem: Sharp, sigma: number) => {
  sharpItem.sharpen(sigma);
};

const format = async (sharpItem: Sharp, formatType: FormatType) => {
  switch (formatType) {
    case FormatType.PNG:
      sharpItem.png({ quality: 60, effort: 5, compressionLevel: 4 ,force: false});
      break;
    case FormatType.GIF:
      sharpItem.gif();
      break;
    case FormatType.WEBP:
      sharpItem.webp({lossless:true, quality: 60, alphaQuality: 80, force: false});
      break;
    case FormatType.JPEG:
      sharpItem.jpeg({ mozjpeg: true });
      break;
  }
};

function dataURItoBlob(dataURI: string, ext: string) {
  var binary = Buffer.from(dataURI, "base64").toString("utf8");
  var array = [];
  for (var i = 0; i < binary.length; i++) {
    array.push(binary.charCodeAt(i));
  }
  return new Blob([new Uint8Array(array)], { type: ext });
}

function convertStringDataToObject(stringData: string) {
  let arr = stringData.split(",");
  let newObj: any = {};
  arr.forEach((eleStr) => {
    let objarr = eleStr.split(":");
    if (objarr[0] !== "") {
      const parseVal = parseFloat(objarr[1]);
      newObj[objarr[0]] = Number.isNaN(parseVal) ? objarr[1] : parseVal;
    }
  });
  return newObj;
}

async function parseImageProcessData(sharpItem: Sharp, fields: Object) {
  for (let [key, value] of Object.entries(fields)) {
    const object = convertStringDataToObject(value);
    if (key === "sharpen") {
      console.log("items", object.sigma);
      await sharpen(sharpItem, object);
    }
    if (key === "format") {
      console.log("format", object);
      await format(sharpItem, (object as FormatInput).format);
    }
    if (key === "resize") {
      console.log("resize", object);
      await resize(sharpItem, object);
    }
    if (key === "crop") {
      console.log("crop", object);
      await crop(sharpItem, object);
    }
  }
}

export { resize, crop, sharpen, format, dataURItoBlob, parseImageProcessData };
