import imageCompression from "browser-image-compression";
import React, { ReactNode, useContext, useState } from "react";
import {
  Dimension,
  FormatInput,
  FormatType,
  ImageInput,
  Rectangle,
  SharpenInput,
  SizeFormat,
  ToggleInput,
} from "../model/Image.model";
import styles from "../styles/Form.module.css";
import { GlobalContext } from "../context/provider";
import { ExclamationCircleIcons } from "./Icons";
import CheckboxGroup from "./CheckboxGroup";
import { base64toBlob, dataURItoBlob } from "../utils/image";
import { saveAs } from "file-saver";
import JSZip from "jszip";

const Form = () => {
  const {
    fileInputState,
    imageUrlState,
    formatInputState,
    formSubmittedState,
  } = useContext(GlobalContext);
  const [resize, setResizeInput] = useState<InputType>();
  const [sharpenInput, setSharpenInput] = useState<InputType>({ sigma: 30 });
  const [enableSharpen, setEnableSharpen] = useState<boolean>(false);
  const [grayscale, setGrayScale] = useState<boolean>(false);
  const [rotate, setRotate] = useState<boolean>(false);
  const [cropInput, setCropInput] = useState<InputType>();
  const [showSizeFormat, setShowSizeFormat] = useState<boolean>(false);

  const sizeCheckboxGroup = Object.entries(SizeFormat).map((size) => ({
    title: `${size[1]} px`,
    onChange: () => {},
  }));

  type InputType =
    | Rectangle
    | SharpenInput
    | ImageInput
    | FormatInput
    | ToggleInput
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
    formSubmittedState?.[1](true);
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
    if(grayscale){
      formData.append("grayscale", convertToString({toggle: grayscale}));
    }
    if(rotate){
      formData.append("rotate", convertToString({toggle: rotate}));
    }
    if (formatInputState?.[0]) {
      formData.append("format", convertToString(formatInputState?.[0]));
    }
    if (fileInputState?.[0]) {
      const compressedFile = await createImageCompression(fileInputState?.[0]);
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
      .then((response) =>
        response.headers.get("Content-Type") === "application/octet-stream"
          ? response.blob()
          : response.json()
      )
      .then(async (blob) => {
        let compressed: File;
        if (blob instanceof Blob) {
          const newblob = new File(
            [blob],
            `test/${formatInputState?.[0]?.format}`,
            {
              type: `image/${formatInputState?.[0]?.format}`,
              lastModified: new Date().getTime(),
            }
          );
          compressed = await createImageCompression(newblob);
          const urlString = URL.createObjectURL(compressed!);
          imageUrlState?.[1](urlString);
          formSubmittedState?.[1](false);
          createLink && createDownloadLink(urlString);
        } else if (Array.isArray(blob.data)) {
          const base64Response = base64toBlob(blob.data[3], "ico");
          const newblob = new File(
            [base64Response],
            `test/${formatInputState?.[0]?.format}`,
            {
              type: `image/${formatInputState?.[0]?.format}`,
              lastModified: new Date().getTime(),
            }
          );

          compressed = await createImageCompression(newblob);
          const urlString = URL.createObjectURL(compressed!);
          imageUrlState?.[1](urlString);
          formSubmittedState?.[1](false);

          if (createLink) {
            const zip = new JSZip();
            const image = zip.folder("images");
            blob.data.forEach((element: string, index: number) => {
              image?.file(index + ".ico", element, { base64: true });
            });
            zip.generateAsync({ type: "blob" }).then(function (content) {
              // Force down of the Zip file
              saveAs(content, "archive.zip");
            });
          }
        }
      });
  };

  const createImageCompression = async (file: File): Promise<File> => {
    return await imageCompression(file, {
      useWebWorker: true,
    });
  };

  const createDownloadLink = (urlString: string) => {
    let a = document.createElement("a");
    if (urlString) {
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

  const opsCheckboxGrp = [
    { title: "greyscale",value:grayscale, onChange: () => setGrayScale(prev=> !prev) },
    { title: "rotate", value:rotate,onChange: () => setRotate(prev=> !prev) },
  ];

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
              disabled={type == FormatType.HEIC}
              onClick={(e) => {
                formatInputState?.[1]({
                  format: e.currentTarget.name as FormatType,
                });
                setShowSizeFormat(e.currentTarget.name === FormatType.ICO);
              }}
              className={`${index == 0 ? "rounded-l" : ""} ${
                index == formatItems.length - 1 ? "rounded-r" : ""
              } ${
                formatInputState?.[0]?.format === type
                  ? "bg-violet-800"
                  : "bg-violet-400"
              } inline-block grow text-white leading-loose text-xs uppercase hover:bg-violet-700 focus:bg-violet-700 focus:outline-none focus:ring-0 active:bg-violet-800 transition duration-150 ease-in-out disabled:bg-violet-200`}
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
      <div className="bg-white dark:bg-slate-600 shadow sm:rounded-md sm:overflow-hidden text-slate-500 dark:text-violet-400">
        <div className="px-2 py-3 space-y-4 sm:p-6 mx-3">
          <div>
            <label className="block font-medium"> Choose photo </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                <svg
                  className="mx-auto h-12 w-12"
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
                <div className="flex text-sm">
                  <label
                    htmlFor="file-upload"
                    className="relative cursor-pointer rounded-md font-medium text-slate-600 dark:text-slate-400 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
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
                <p className="text-slate-600 dark:text-slate-300 text-xs">
                  PNG, JPG, GIF up to 8MB
                </p>
              </div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1">
              <label htmlFor="resize" className="block font-medium">
                {" "}
                resize
              </label>
              <ExclamationCircleIcons
                size={16}
                styles={"fill-gray-500 dark:fill-gray-300 scale-75"}
                tooltipwithtext="resize width & height"
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-200">
                  width:{" "}
                </span>
                <input
                  type="number"
                  name="width"
                  id="width"
                  onChange={(e) => onChange(e, setResizeInput)}
                  autoComplete="width"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm border-gray-300"
                />
              </div>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-200">
                  height:{" "}
                </span>
                <input
                  type="number"
                  name="height"
                  id="height"
                  onChange={(e) => onChange(e, setResizeInput)}
                  autoComplete="height"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1">
              <label htmlFor="crop" className="block font-medium">
                {" "}
                crop
              </label>
              <ExclamationCircleIcons
                size={16}
                styles={"fill-gray-500 dark:fill-gray-300 scale-75"}
                tooltipwithtext="crop image size starting from top left hand point"
              />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-3">
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-200 ">
                  width:{" "}
                </span>
                <input
                  type="number"
                  name="width"
                  id="width"
                  onChange={(e) => onChange(e, setCropInput)}
                  autoComplete="width"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm border-gray-300"
                />
              </div>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-200">
                  height:{" "}
                </span>
                <input
                  type="number"
                  name="height"
                  id="height"
                  onChange={(e) => onChange(e, setCropInput)}
                  autoComplete="height"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm border-gray-300"
                />
              </div>
              <div className="mt-1 flex rounded-md">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-200">
                  left:{" "}
                </span>
                <input
                  type="number"
                  name="left"
                  id="left"
                  onChange={(e) => onChange(e, setCropInput)}
                  autoComplete="left"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm border-gray-300"
                />
              </div>
              <div className="mt-1 flex">
                <span className="inline-flex items-center px-1 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 dark:bg-gray-200">
                  top:{" "}
                </span>
                <input
                  type="number"
                  name="top"
                  id="top"
                  onChange={(e) => onChange(e, setCropInput)}
                  autoComplete="top"
                  className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block rounded-r-md border border-l-0 w-full shadow-sm border-gray-300"
                />
              </div>
            </div>
          </div>
          <div>
            <div className="inline-flex items-center gap-1">
              <label htmlFor="processing" className="block font-medium">
                {" "}
                processing
              </label>
              <ExclamationCircleIcons
                  size={16}
                  styles={"fill-gray-500 dark:fill-gray-300 scale-75"}
                  tooltipwithtext="image processing operations"
                />
              </div>
              <div className="mt-1 flex items-center justify-center">
                <CheckboxGroup grpCheckbox={opsCheckboxGrp} />
              </div>
          </div>
          <div>
            <div>
              <div className="inline-flex items-center gap-1">
                <label htmlFor="sharpen" className="block font-medium">
                  {" "}
                  sharpen
                </label>
                <ExclamationCircleIcons
                  size={16}
                  styles={"fill-gray-500 dark:fill-gray-300 scale-75"}
                  tooltipwithtext="select checkbox to toggle image sharpening"
                />
              </div>
              <input
                type="checkbox"
                className="border-gray-300 rounded ml-1 h-3 w-3"
                onChange={onEnableSharpen}
                checked={enableSharpen}
              />
            </div>
            <div className="mt-1 flex items-center justify-center">
              <input
                type="range"
                className={[
                  "range w-full h-2 bg-violet-200 rounded-lg appearance-none",
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
            <div className="inline-flex items-center gap-1">
              <label htmlFor="format" className="block font-medium">
                {" "}
                format
              </label>
              <ExclamationCircleIcons
                size={16}
                styles={"fill-gray-500 dark:fill-gray-300 scale-75"}
                tooltipwithtext="select format options"
              />
            </div>
            <div className="mt-1 flex items-center justify-center">
              <div
                className="flex grow items-center shadow-md hover:shadow-lg focus:shadow-lg"
                role="group"
              >
                {buttonGroup()}
              </div>
            </div>
            <div
              className={`mt-3 flex items-center justify-center ${
                !showSizeFormat && "hidden"
              }`}
            >
              <CheckboxGroup grpCheckbox={sizeCheckboxGroup} disabled={true} />
            </div>
          </div>
        </div>
        <div className="px-4 py-3 dark:bg-slate-700 text-right sm:px-6">
          <button
            type="button"
            onClick={onPreview}
            disabled={!fileInputState?.[0]}
            className="inline-flex justify-center m-1 py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Preview
          </button>
          <button
            disabled={!fileInputState?.[0]}
            type="submit"
            className="inline-flex justify-center m-1 py-1 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
