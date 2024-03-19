import React from "react";
import FileUploader from "./FileUploader";

export default function Home() {
  return (
    <main className="container min-h-screen flex items-center justify-center">
      <div className="relative text-center flex flex-col items-center h-full justify-center">
        <button
          className="group relative rounded-full p-px text-sm/6 text-zinc-400 duration-300 hover:text-zinc-100 hover:shadow-glow mb-5"
          type="button"
        >
          <span className="absolute inset-0 overflow-hidden rounded-full">
            <span className="absolute inset-0 rounded-full bg-[image:radial-gradient(75%_100%_at_50%_0%,rgba(248, 56, 56, 0.6)_0%,rgba(56,189,248,0)_75%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100"></span>
          </span>
          <div className="relative z-10 rounded-full bg-zinc-950 px-4 py-1.5 ring-1 ring-white/10">
            Let AI do the magic
          </div>
          <span className="absolute -bottom-0 left-[1.125rem] h-px w-[calc(100%-2.25rem)] bg-gradient-to-r from-cyan-400/0 via-cyan-400/90 to-cyan-400/0 transition-opacity duration-500 group-hover:opacity-40"></span>
        </button>
        <h1 className="bg-gradient-to-br text-white bg-clip-text text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-transparent drop-shadow-2xl lg:max-w-5xl">
          <span className="text-primary">The last resume edit</span> you&apos;ll
          ever need.
        </h1>
        <div className="max-w-7xl mt-14 w-full">
          <FileUploader />
        </div>
      </div>
    </main>
  );
}
