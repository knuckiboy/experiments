import Head from "next/head";
import React, { useEffect, useState } from "react";
import { ImageIcon } from "./Icons";

type Props = {
  children: React.ReactNode;
};

export default function Layout({ children }: Props) {
  
  const toggleTheme = ()=>{
    const theme = localStorage.getItem("theme")== null? "light": localStorage.getItem("theme")
    localStorage.setItem("theme", theme==="dark"?"light":"dark")
    theme==="dark"?  document.documentElement.classList.add('dark'): document.documentElement.classList.remove('dark')
  }
  return (
    <div className="bg-white dark:bg-slate-800 flex min-h-screen flex-col items-center justify-center text-slate-500 dark:text-slate-400">
      <Head>
        <title>Image Render App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="flex h-12 w-full items-center justify-between border-b">
        <div className="container flex justify-center lg:justify-between mx-auto px-1 items-center">
          <div className="flex items-center gap-2 ">
            <ImageIcon size={16} styles={"fill-violet-500 dark:fill-violet-300  scale-150"} />
            <h2>Image Render App</h2>
          </div>
          <div className="hidden lg:flex items-center gap-3">
            <button type="button" onClick={toggleTheme} className="gap-2 text-xs fill-slate-600 dark:fill-slate-200 hover:bg-violet-300 dark:hover:bg-violet-400 px-5 py-2.5 text-center inline-flex items-center rounded-lg">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 16 16"
              >
                <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0zm0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13zm8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5zM3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8zm10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0zm-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0zm9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707zM4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708z" />
              </svg>
              dark mode
            </button>
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
