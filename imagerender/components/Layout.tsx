import Head from "next/head";
import React from "react";
import { ImageIcon } from "./Icons";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Image Render App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex h-12 w-full items-center justify-between border-b">
        <div className="container flex  justify-center lg:justify-between mx-auto px-1 items-center">
          <div className="flex items-center gap-2">
            <ImageIcon size={16}
                styles={"fill-violet-500 scale-150"}/>
            <h2>Image Render App</h2>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <div className="text-xs"> dark mode</div>
          </div>
        </div>
        <div></div>
      </header>
      <>{children}</>
      <footer className="relative flex h-12 w-full items-center justify-between border-t">
        <div className="container flex justify-between mx-auto px-4">
          <div className="text-xs">Powered by Nextjs & Sharp</div>
          <div className="text-xs">Done by Jian Nan</div>
        </div>
      </footer>
    </div>
  );
}
