import React from "react";
import { cn } from "../../lib/utils";

function Skeleton({ className, ...props }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-slate-200/50 ${className}`}
      {...props}
    />
  );
}

export { Skeleton };
