import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "flex h-9 w-full rounded-lyra-sm border border-lyra-border-default bg-lyra-bg-field px-3 py-2 lyra-body-md text-lyra-fg-default ring-offset-white file:border-0 file:bg-transparent file:lyra-body-md-emphasis placeholder:text-lyra-fg-disabled focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-active focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
