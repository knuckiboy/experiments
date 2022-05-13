export class ImageInput {
  imagefile = "";
  resize!: Dimension;
  crop!: Rectangle;
  sharpen!: number;
}

export type Dimension = {
  width?: number;
  height?: number;
};

export type Rectangle = Dimension & {
  left?: number;
  top?: number;
};

export type SharpenInput = {
  sigma?: number;
};
export type DetailedSharpenInput = {
  sigma?: number;
  m1?: number;
  m2?: number;
  x1?: number;
  y2?: number;
  y3?: number;
};

export type FormatInput = {
  format: FormatType
}

export enum FormatType {
  PNG = "png",
  WEBP = "webp",
  JPEG = "jpeg",
  GIF = "gif",
  ICO = "ico",
}
