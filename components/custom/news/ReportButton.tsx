"use client";

import React, { useState, useEffect } from "react";
import { Flag } from "lucide-react";
import { cn } from "@/lib/utils";
import { reportNewsItem } from "@/app/developer/news/actions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export const ReportButton = ({
  id,
  className,
}: {
  id: string;
  className?: string;
}) => {
  const [isReported, setIsReported] = useState(false);
  const [isReporting, setIsReporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (id && typeof window !== "undefined") {
      try {
        const reported = JSON.parse(
          localStorage.getItem("reportedNews") || "[]",
        );
        if (reported.includes(id)) setIsReported(true);
      } catch (e) {}
    }
  }, [id]);

  const handleReport = async (e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!id || isReported || isReporting) return;

    setIsReporting(true);
    try {
      const res = await reportNewsItem(id);
      if (res && res.success) {
        setIsReported(true);
        const reported = JSON.parse(
          localStorage.getItem("reportedNews") || "[]",
        );
        reported.push(id);
        localStorage.setItem("reportedNews", JSON.stringify(reported));
        alert(
          "Thank you for your report. We will review this article shortly.",
        );
      } else {
        alert("Failed to report this article. Please try again later.");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReporting(false);
    }
  };

  const buttonContent = (
    <Tooltip>
      <TooltipTrigger asChild>
        <button
          title="Report issue with this news"
          className={cn(
            "transition-all p-2 rounded-full border border-transparent outline-none cursor-pointer",
            isReported
              ? "text-red-500 bg-red-50"
              : "hover:text-red-500 hover:bg-slate-50",
            isReporting && "opacity-50 cursor-not-allowed",
            className,
          )}
          disabled={isReported || isReporting}
          onClick={(e) => {
            if (isReported || isReporting) {
              e.preventDefault();
              e.stopPropagation();
            } else {
              e.stopPropagation();
              setIsOpen(true);
            }
          }}
        >
          <Flag
            className={cn(
              "w-[16px] h-[16px]",
              isReported ? "fill-red-500" : "",
            )}
          />
        </button>
      </TooltipTrigger>
      <TooltipContent>Report this news</TooltipContent>
    </Tooltip>
  );

  if (isReported || isReporting) {
    return (
      <div className="inline-flex items-center space-x-1">{buttonContent}</div>
    );
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        <div
          className="inline-flex items-center space-x-1"
          onClick={(e) => e.stopPropagation()}
        >
          {buttonContent}
        </div>
      </AlertDialogTrigger>

      <AlertDialogContent className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-md w-full p-6 shadow-2xl text-left">
        <AlertDialogHeader className="text-left gap-1.5 p-0">
          <AlertDialogTitle className="text-lg text-slate-900 dark:text-white font-sans">
            Report this content?
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-light">
            This will submit a report to our moderation team indicating that
            this news article is inappropriate or violates our policies.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex flex-row sm:justify-end gap-3 p-0 mt-4">
          <AlertDialogCancel className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors border border-slate-200 dark:border-slate-800 bg-transparent">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={(e) => {
              handleReport(e as any);
              setIsOpen(false);
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors border-transparent"
          >
            Submit Report
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
