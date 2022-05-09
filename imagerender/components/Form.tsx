import imageCompression from "browser-image-compression";
import React, { ReactNode, useContext, useRef, useState } from "react";
import {
  Dimension,
  FormatInput,
  FormatType,
  ImageInput,
  Rectangle,
  SharpenInput,
} from "../model/Image.model";
import Image from "next/image";
import styles from "../styles/Form.module.css";
import { GlobalContext } from "../context/provider";

const Form = () => {
  const { fileInputState, imageUrlState, formatInputState } =
    useContext(GlobalContext);
  const [resize, setResizeInput] = useState<InputType>();
  const [sharpenInput, setSharpenInput] = useState<InputType>({ sigma: 30 });
  const [enableSharpen, setEnableSharpen] = useState<boolean>(false);
  // const [fileInput, setFileInput] = useState<File>();
  // const [imageBlob, setImageBlob] = useState<string>();
  const [cropInput, setCropInput] = useState<InputType>();
  // const [formatInput, setFormatInput] = useState<FormatInput>({
  //   format: FormatType.JPEG,
  // });

  type InputType =
    | Rectangle
    | SharpenInput
    | ImageInput
    | FormatInput
    | Dimension
    | undefined;

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<InputType>>
  ) => {
    setState((prevState) => {
      if (prevState) {
        return { ...prevState, [e.target.name]: e.target.value };
      } else {
        return { [e.target.name]: e.target.value };
      }
    });
  };

  const onEnableSharpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEnableSharpen((prev) => !prev);
  };

  const uploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    fileInputState?.[1](e.target.files?.[0]);
    if (e.target.files?.[0]?.type) {
      const ext = e.target.files?.[0]?.type.split("/")[1];
      formatInputState?.[1]({ format: ext as FormatType });
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLElement>) => {
    await _submitPost(e, true);
  };

  const _submitPost = async (
    e: React.FormEvent<HTMLElement>,
    createLink: boolean
  ) => {
    e.preventDefault();
    const formData = new FormData();
    if (resize) {
      formData.append("resize", convertToString(resize));
    }
    if (enableSharpen && sharpenInput) {
      formData.append("sharpen", convertToString(sharpenInput));
    }
    if (cropInput) {
      formData.append("crop", convertToString(cropInput));
    }
    if (formatInputState?.[0]) {
      formData.append("format", convertToString(formatInputState?.[0]));
    }
    if (fileInputState?.[0]) {
      const compressedFile = await imageCompression(fileInputState?.[0], {
        useWebWorker: true,
      });
      formData.append("file", compressedFile);
    }
    postData(formData, createLink);
  };

  const onPreview = async (e: React.FormEvent<HTMLElement>) => {
    await _submitPost(e, false);
  };

  const convertToString = (inputType: InputType | string) => {
    let stringData = "";
    if (inputType) {
      for (let [key, value] of Object.entries(inputType)) {
        if (key.length !== 0) {
          stringData += key + ":" + value + ",";
        }
      }
    }
    return stringData;
  };

  const postData = (formData: FormData, createLink: boolean) => {
    fetch("api/image/resize", {
      method: "POST",
      body: formData,
    })
      .then((response) => response.blob())
      .then((blob) => {
        const newblob = new Blob([blob], {
          type: `image/${formatInputState?.[0]?.format}`,
        });
        const urlString = URL.createObjectURL(newblob);
        imageUrlState?.[1](urlString);
        createLink && createDownloadLink(urlString);
      });
  };

  const createDownloadLink = (urlString: string) => {
    let a = document.createElement("a");
    if (urlString) {
      console.log(urlString);
      a.href = urlString;
    }
    a.setAttribute(
      "download",
      `${crypto.getRandomValues(new Uint32Array(1))}.${
        formatInputState?.[0]?.format
      }`
    );
    a.click();
  };

  const formatItems = Object.values(FormatType);

  const buttonGroup = (): ReactNode => {
    return (
      <>
        {formatItems.map((type, index) => {
          return (
            <button
              key={index}
              type="button"
              id={type}
              name={type}
              onClick={(e) =>
                formatInputState?.[1]({
                  format: e.currentTarget.name as FormatType,
                })
              }
              className={`${index == 0 ? "rounded-l" : ""} ${
                index == formatItems.length - 1 ? "rounded-r" : ""
              } ${
                formatInputState?.[0]?.format === type
                  ? "bg-violet-800"
                  : "bg-violet-400"
              } inline-block px-4 py-2  text-white font-medium text-xs leading-tight uppercase hover:bg-violet-700 focus:bg-violet-700 focus:outline-none focus:ring-0 active:bg-violet-800 transition duration-150 ease-in-out`}
            >
              {type}
            </button>
          );
        })}
      </>
    );
  };

  return (
    <form onSubmit={onSubmit}>
      <div className="shadow sm:rounded-md sm:overflow-hidden">
        <div className="px-2 py-5 bg-white space-y-6 sm:p-6 m-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              {" "}
              Choose photo{" "}
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className="flex text-sm text-gray-600">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                  >
                    <span>Upload a file</span>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      accept="image/*"
                      onChange={uploadImage}
                      className="sr-only"
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 8MB</p>
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="resize"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              resize
            </label>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              <div className="mt-1 flex rounded-md">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  width:{" "}
                </span>
                <input
                  type="number"
                  name="width"
                  id="width"
                  onChange={(e) => onChange(e, setResizeInput)}
                  autoComplete="width"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm text-sm border-gray-300"
                />
              </div>
              <div className="mt-1 flex rounded-md">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  height:{" "}
                </span>
                <input
                  type="number"
                  name="height"
                  id="height"
                  onChange={(e) => onChange(e, setResizeInput)}
                  autoComplete="height"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm text-sm border-gray-300"
                />
              </div>
            </div>
          </div>
          <div>
            <label
              htmlFor="crop"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              crop
            </label>
            <div className="grid md:grid-cols-2 grid-cols-1 gap-6">
              <div className="mt-1 flex rounded-md">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  width:{" "}
                </span>
                <input
                  type="number"
                  name="width"
                  id="width"
                  onChange={(e) => onChange(e, setCropInput)}
                  autoComplete="width"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm text-sm border-gray-300"
                />
              </div>
              <div className="mt-1 flex rounded-md">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  height:{" "}
                </span>
                <input
                  type="number"
                  name="height"
                  id="height"
                  onChange={(e) => onChange(e, setCropInput)}
                  autoComplete="height"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm text-sm border-gray-300"
                />
              </div>
              <div className="mt-1 flex rounded-md">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  left:{" "}
                </span>
                <input
                  type="number"
                  name="left"
                  id="left"
                  onChange={(e) => onChange(e, setCropInput)}
                  autoComplete="left"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm text-sm border-gray-300"
                />
              </div>
              <div className="mt-1 flex rounded-md">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                  top:{" "}
                </span>
                <input
                  type="number"
                  name="top"
                  id="top"
                  onChange={(e) => onChange(e, setCropInput)}
                  autoComplete="top"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm text-sm border-gray-300"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-2">
              <label
                htmlFor="resize"
                className="block text-sm font-medium text-gray-700"
              >
                {" "}
                sharpen
              </label>
              <input
                type="checkbox"
                className="border-gray-300 rounded h-3 w-3"
                onChange={onEnableSharpen}
                checked={enableSharpen}
              />
            </div>
            <div className="mt-1 flex items-center justify-center">
              <input
                type="range"
                className={[
                  "w-full h-2 bg-violet-100 rounded-lg appearance-none",
                  styles["slider-thumb"],
                ].join(" ")}
                id="sigma"
                name="sigma"
                min={0.3}
                max={1000}
                disabled={!enableSharpen}
                value={(sharpenInput as SharpenInput).sigma}
                onChange={(e) => onChange(e, setSharpenInput)}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="resize"
              className="block text-sm font-medium text-gray-700"
            >
              {" "}
              format
            </label>
            <div className="mt-1 flex items-center justify-center">
              <div
                className="inline-flex shadow-md hover:shadow-lg focus:shadow-lg"
                role="group"
              >
                {buttonGroup()}
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex justify-center m-1 py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Preview
          </button>
          <button
            type="submit"
            className="inline-flex justify-center m-1 py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
