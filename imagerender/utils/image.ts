import { Sharp } from "sharp";
import { Dimension, FormatType, Rectangle } from "../model/Image.model";

const resize = async (sharpItem: Sharp, size: Dimension) => {
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
      sharpItem.png({ quality: 80, effort: 5, compressionLevel: 4 });
      break;
    case FormatType.GIF:
      sharpItem.gif();
      break;
    case FormatType.WEBP:
      sharpItem.webp({ nearLossless: true });
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

function parseImageProcessData(sharpItem: Sharp, fields: Object) {
  for (let [key, value] of Object.entries(fields)) {
    const valueData = value ?? JSON.parse(value);
    if (key === "sharpen") {
      // sharpen(image, valueData);
      console.log("sharp", valueData);
    }
    if (key === "format") {
      // format(image, valueData);
      console.log("format", valueData);
    }
    if (key === "resize") {
      console.log("resize", valueData);
      // resize(image, valueData);
    }
    if (key === "crop") {
      console.log("crop", valueData);
      // crop(image, valueData);
    }
  }
  // return image;
}

export { resize, crop, sharpen, format, dataURItoBlob, parseImageProcessData };
