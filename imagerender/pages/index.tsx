import type { NextPage } from "next";
import Image from "next/image";
import sharp from "sharp";
import Form from "../components/Form";
import defaultImage from "../public/image/default-img.jpg";
import { resize } from "../utils/image";

type ImageProps = {
  imageBuffer: string;
};

const Home: NextPage<ImageProps> = ({ imageBuffer }: ImageProps) => {
  return (
    <main className="flex w-full flex-1 flex-col items-center justify-start text-center">
      <div className="flex flex-wrap gap-2 justify-evenly">
        <div className="my-6 w-full lg:w-8/12 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
          <div className="flex gap-2 flex-wrap lg:flex-nowrap">
            <div className="w-[100%] flex items-center flex-col">
              <div className={"w-full lg:w-[25vw] h-[70vh] relative"}>
                <Image
                  alt="defaultPic"
                  src={defaultImage}
                  layout="fill"
                  objectFit="contain"
                />
              </div>
              <h5>original</h5>
            </div>
            <div className="w-[100%] flex items-center flex-col">
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
          </div>
        </div>
        <div className="my-6 w-full lg:w-3/12 rounded-xl border p-6 text-left hover:text-blue-600 focus:text-blue-600">
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
