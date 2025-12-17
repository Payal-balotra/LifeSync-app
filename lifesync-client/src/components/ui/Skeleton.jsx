import React from "react";
import { cn } from "../lib/utils"; // Assuming you have a cleanup/utils file, or I'll just use tailwind-merge directly if typically used, but clsx/tailwind-merge is safer.

function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/50 ${className}`}
      {...props}
    />
  );
}

export { Skeleton };
