"use client";

import CircularProgressBar from "@/components/CircularProgressBar";
import { Skeleton } from "@/components/ui/skeleton";
import { getProgressColor } from "@/lib/getProgressColor";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Markdown from "react-markdown";
import useSWR from "swr";

const fetcher = async (args) => {
  return fetch(args[0], {
    method: "POST",
    body: JSON.stringify({ pdf_data: args[1] }),
  }).then((res) => res.json());
};

const Page = () => {
  const { data, error, isLoading } = useSWR(
    ["/api/analyse", localStorage?.getItem("pdf_text") || ""],
    fetcher
  );

  if (error || !data?.success)
    return <div>Error: {error?.message || data?.message}</div>;
  if (isLoading)
    return (
      <>
        <div className="p-4 pb-5  sm:px-6 sm:pt-6 space-y-8 flex flex-col items-center">
          <h2 className="pb-2 text-xl md:text-3xl font-medium text-center mb-8 mt-8">
            Please wait while we analyse your resume
          </h2>
          <Skeleton className="h-[250px] w-[250px] rounded-full" />
        </div>
        <div className="mt-5">
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-full rounded-xl" />
            <div className="space-y-3">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-9/12" />
            </div>
          </div>
        </div>
      </>
    );

  return (
    <>
      <section className="relative bg-transparent p-4 pb-5  sm:px-6 sm:pt-6">
        <h2 className="pb-2 text-3xl lg:text-4xl xl:text-5xl font-bold text-center mb-8">
          Overall Score
        </h2>
        <div className="flex flex-col items-center justify-center p-2 px-8">
          <h2 className="w-full bg-gradient-to-tr bg-clip-text pt-[15px] font-bold text-center text-8xl text-transparent from-primary to-yellow-500 absolute ">
            {data.scoreResume}
          </h2>
          <CircularProgressBar
            percentage={data.scoreResume}
            size={250}
            strokeWidth={20}
            color={getProgressColor(data.scoreResume)}
          />
        </div>
      </section>

      <div className="relative overflow-hidden rounded-xl border bg-black p-4 pb-5 border-green-500 dark:bg-transparent sm:px-6 sm:pt-6 mt-10 markdown-container">
        <Markdown>{data?.goodPointers}</Markdown>
      </div>
      <div className="relative overflow-hidden rounded-xl border bg-black p-4 pb-5  border-red-500 dark:bg-transparent sm:px-6 sm:pt-6 mt-10 markdown-container">
        <Markdown>{data?.badPointers}</Markdown>
      </div>

      <section className="relative overflow-hidden rounded-xl border bg-black p-4 pb-5  darkborder-slate-600 dark:bg-transparent sm:px-6 sm:pt-6 mt-10">
        <h2 className="pb-2 text-2xl lg:text-3xl xl:text-3xl 2xl:text-3xl font-bold">
          Recommended Job Roles
        </h2>
        <hr className="mb-5" />

        {data?.jobs.map((job) => (
          <div
            key={job}
            className="py-3 mb-5 flex gap-5 items-center flex-wrap"
          >
            <h3>{job}</h3>
            <Link
              href={`https://www.linkedin.com/jobs/search/?keywords=${job}`}
              target="_blank"
              className="inline-flex items-center border rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary hover:bg-secondary/80 border-transparent cursor-pointer bg-gradient-to-r from-red-900 to-red-700 py-1 px-2 text-white whitespace-nowrap"
            >
              See {job} Jobs on Linkedin
              <ExternalLink className="h-4 w-4 ml-2" />
            </Link>
          </div>
        ))}
      </section>
    </>
  );
};

export default Page;
