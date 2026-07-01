import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface AppNameProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** App icon — an img element or SVG component */
  icon: React.ReactNode;
  /** Application name text */
  name: string;
}

const AppName = React.forwardRef<HTMLButtonElement, AppNameProps>(
  ({ className, icon, name, ...props }, ref) => (
    <div className="inline-flex items-center gap-2.5">
      <span className="flex-shrink-0">{icon}</span>
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center gap-1 rounded-lyra-sm px-2 py-1.5 transition-colors",
          "hover:bg-lyra-state-hover active:bg-lyra-state-pressed",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-focus focus-visible:ring-offset-2",
          className
        )}
        {...props}
      >
        <span className="text-[16px] font-medium text-lyra-fg-default">{name}</span>
        <ChevronDown
          className="h-3.5 w-3.5 text-lyra-fg-secondary"
          strokeWidth={1.5}
        />
      </button>
    </div>
  )
);
AppName.displayName = "AppName";

export { AppName };
