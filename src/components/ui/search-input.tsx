import * as React from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /** Controlled value */
  value?: string;
  /** Called when the value changes */
  onValueChange?: (value: string) => void;
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, value, onValueChange, onChange, ...props }, ref) => {
    const hasValue = value != null && value.length > 0;

    return (
      <div className={cn("relative", className)}>
        <Search
          className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-lyra-fg-secondary pointer-events-none"
          strokeWidth={1.5}
        />
        <input
          ref={ref}
          type="text"
          value={value}
          onChange={(e) => {
            onChange?.(e);
            onValueChange?.(e.target.value);
          }}
          className={cn(
            "h-9 w-full rounded-lyra-sm border border-lyra-border-default bg-lyra-bg-field pl-9 pr-9 lyra-body-md text-lyra-fg-default transition-colors",
            "placeholder:text-lyra-fg-disabled",
            "hover:border-lyra-border-strong",
            "focus:outline-none focus:border-lyra-border-active focus:ring-2 focus:ring-lyra-border-active/20",
            "disabled:opacity-40 disabled:hover:border-lyra-border-default disabled:cursor-not-allowed disabled:bg-lyra-bg-disabled"
          )}
          {...props}
        />
        {hasValue && (
          <button
            type="button"
            onClick={() => onValueChange?.("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-5 w-5 items-center justify-center rounded-lyra-xs text-lyra-fg-secondary hover:text-lyra-fg-default hover:bg-lyra-state-hover transition-colors"
            tabIndex={-1}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" strokeWidth={1.5} />
          </button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = "SearchInput";

export { SearchInput };
