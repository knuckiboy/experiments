import type { NextPage } from "next";
import Image from "next/image";
import { useContext } from "react";
import sharp from "sharp";
import Form from "../components/Form";
import { LoadingIcon } from "../components/Icons";
import { GlobalContext } from "../context/provider";
import defaultImage from "../public/image/default-img.jpg";
import { resize } from "../utils/image";

type ImageProps = {
  imageBuffer: string;
};

const Home: NextPage<ImageProps> = ({ imageBuffer }: ImageProps) => {
  const { fileInputState, imageUrlState, formSubmittedState } =
    useContext(GlobalContext);
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-start text-center">
      <div className="flex flex-wrap gap-2 justify-evenly w-[100vw]">
        <div className="my-6 w-full lg:w-8/12 rounded-xl border p-4 text-left hover:text-blue-600 focus:text-blue-600">
          <div className="flex flex-wrap lg:flex-nowrap">
            <div className="w-full flex items-center flex-col">
              <div className={"w-full lg:w-[25vw] h-[70vh] relative"}>
                <Image
                  alt="defaultPic"
                  src={
                    fileInputState?.[0]
                      ? URL.createObjectURL(fileInputState?.[0])
                      : defaultImage
                  }
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h5>original</h5>
            </div>
            {
              !fileInputState?.[0] ? (
                <div className="w-full flex items-center flex-col">
                  <div className={"w-full lg:w-[25vw] h-[70vh] relative"}>
                    <Image
                      src={"data:image/png;base64, " + imageBuffer}
                      alt="renderedPic"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <h5>rendered</h5>
                </div>
              ) : (
                <div className="w-full flex items-center flex-col">
                  <div className={"w-full lg:w-[25vw] h-[70vh] relative"}>
                    {imageUrlState?.[0] ? (
                      <Image
                        src={imageUrlState?.[0]}
                        alt="renderedPic"
                        layout="fill"
                        objectFit="contain"
                      />
                    ) : (
                      <>
                        <div className="mt-1 flex px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md h-full justify-center">
                          <div className="border-2 border-gray-300 border-dashed rounded-md flex flex-col justify-center items-center px-3 py-4">
                            <h4 className="text-gray-500 text-center">
                              click on preview to view image operation{" "}
                            </h4>
                            {formSubmittedState?.[0] && <LoadingIcon />}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                  <h5>rendered</h5>
                </div>
              )
            }
          </div>
        </div>
        <div className="my-6 w-full lg:w-3/12 rounded-xl border p-4 text-left hover:text-blue-600 focus:text-blue-600">
          <Form />
        </div>
      </div>
    </main>
  );
};

export async function getStaticProps() {
  const sharpItem = sharp("public/image/default-img.jpg");
  resize(sharpItem, { width: 300, height: 300 });
  const info = await sharpItem.toBuffer();
  return {
    props: {
      imageBuffer: info.toString("base64"),
    },
  };
}

export default Home;
