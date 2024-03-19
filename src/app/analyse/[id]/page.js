"use client";

import CircularProgressBar from "@/components/CircularProgressBar";
import { Skeleton } from "@/components/ui/skeleton";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export const revalidate = 0;
export const dynamic = "force-dynamic";

const Page = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/analyse", {
          method: "POST",
          body: JSON.stringify({ pdf_text: localStorage?.getItem("pdf_text") }),
        });
        if (!response.ok) throw new Error(response.statusText);
        const json = await response.json();
        setIsLoading(false);
        setData(json);
        setError(null);
      } catch (error) {
        setError(`${error} Could not Fetch Data `);
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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

  if (error || !data?.success)
    return <div>Error: {error?.message || data?.message}</div>;

  return (
    <>
      <section className="relative bg-transparent p-4 pb-5  sm:px-6 sm:pt-6">
        <h2 className="pb-2 text-3xl lg:text-4xl font-bold text-center mb-8">
          Overall Score
        </h2>
        <div className="flex flex-col items-center justify-center p-2 px-8">
          <CircularProgressBar
            progress={data.scoreResume}
            strokeWidth={6}
            r="59"
            cx="80"
            cy="80"
            size={160}
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
              className="inline-flex items-center border rounded-full text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-secondary hover:bg-secondary/80 cursor-pointer bg-gradient-to-r from-background to-primary/70 py-1 px-2 text-white whitespace-nowrap"
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
