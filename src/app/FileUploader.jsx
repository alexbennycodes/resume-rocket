"use client";

import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

const FileUploader = () => {
  const {
    getRootProps,
    getInputProps,
    acceptedFiles,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    noKeyboard: true,
    maxFiles: 1,
    accept: {
      pdf: [".pdf"],
    },
  });

  const router = useRouter();
  const [isUploading, setIsUploading] = useState();

  useEffect(() => {
    localStorage.removeItem("pdf_text");
    if (acceptedFiles.length > 0) handleFile();
  }, [acceptedFiles]);

  const handleFile = async () => {
    const formData = new FormData();
    formData.append("file", acceptedFiles[0]);
    setIsUploading(true);
    localStorage.removeItem("pdf_text");
    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const { success, data } = await response.json();
      if (success) {
        localStorage.setItem("pdf_text", JSON.stringify(data));
        const date = new Date().valueOf();
        router.push(`/analyse/${date}`);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full h-[20rem] bg-background  rounded-xl border border-primary/50 relative overflow-hidden">
      <div
        className={cn(
          "h-full w-full p-5 z-20 absolute  transition-all ease-in-out duration-300 hover:bg-primary/[0.1]",
          acceptedFiles.length > 0 ? "bg-primary/[0.1]" : ""
        )}
      >
        <div
          {...getRootProps({
            className: cn(
              "dropzone w-full h-full border border-2 border-dashed rounded-xl flex flex-col justify-center items-center",
              `${isFocused ? "border-blue-500" : ""}`,
              `${isDragAccept ? "border-blue-500" : ""}`,
              `${isDragReject ? "border-primary" : ""}`,
              `${acceptedFiles.length > 0 ? "border-primary" : ""}`
            ),
          })}
        >
          <input {...getInputProps()} />

          <div className="flex flex-col justify-center items-center">
            <FolderIcon width={75} height={75} className="text-primary" />
            {!isUploading ? (
              <>
                {acceptedFiles.length > 0 ? (
                  <div className="my-4 flex items-center justify-center gap-3">
                    <p className="text-sm md:text-base">
                      {acceptedFiles[0]?.path}
                    </p>
                    <RefreshCw className="h-5 w-5" />
                  </div>
                ) : (
                  <p className="my-4 text-sm md:text-base">
                    Drag and Drop your resume here
                  </p>
                )}
                <p className="pt-4 text-xs font-medium leading-5 text-muted-foreground lg:text-sm">
                  Must be in .pdf format, as its better for ATS Compatibility.
                </p>
              </>
            ) : (
              <>
                <p className="my-4 text-sm md:text-base">
                  Uploding your resume
                </p>
                <p className="pt-4 text-xs font-medium leading-5 text-muted-foreground lg:text-sm">
                  Must be in .pdf format, as its better for ATS Compatibility.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
      <div className="grain"></div>
    </div>
  );
};

export default FileUploader;

const FolderIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g stroke="currentColor" strokeWidth={1.5}>
      <path
        d="M12 17v-7m0 0l3 3m-3-3l-3 3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M16 7H8" strokeLinecap="round" />
      <path
        opacity={0.5}
        d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12z"
      />
    </g>
  </svg>
);
