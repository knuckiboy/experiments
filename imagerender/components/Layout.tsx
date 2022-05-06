import Head from "next/head";
import React from "react";

type LayoutProps = {
  children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Head>
        <title>Image Render App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex h-12 w-full items-center justify-start border-b">
        <h2 className="mx-auto md:mx-11">Image Render App</h2>
      </header>
      <>{children}</>
      <footer className="relative flex h-12 w-full items-center justify-between border-t">
        <div className="container flex justify-between mx-auto px-4">
         <div className="text-xs">Powered by Nextjs & Sharp</div> 
        </div>
      </footer>
    </div>
  );
}
