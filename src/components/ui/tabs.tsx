import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Tab List (container with bottom border) ── */

interface TabListProps extends React.HTMLAttributes<HTMLDivElement> {
  /** When true, tabs stretch to fill the full width */
  fullWidth?: boolean;
}

const TabList = React.forwardRef<HTMLDivElement, TabListProps>(
  ({ className, fullWidth, ...props }, ref) => (
    <div
      ref={ref}
      role="tablist"
      className={cn(
        "flex border-b border-lyra-border-subtle",
        fullWidth ? "[&>*]:flex-1" : "gap-1",
        className
      )}
      {...props}
    />
  )
);
TabList.displayName = "TabList";

/* ── Tab (individual tab button) ── */

interface TabProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
  icon?: React.ReactNode;
}

const Tab = React.forwardRef<HTMLButtonElement, TabProps>(
  ({ className, active, icon, children, ...props }, ref) => (
    <button
      ref={ref}
      role="tab"
      aria-selected={active}
      className={cn(
        "group relative inline-flex items-center justify-center gap-2 px-3 py-2.5 lyra-body-md-emphasis transition-colors",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-focus focus-visible:ring-offset-2",
        active
          ? "text-lyra-fg-action"
          : "text-lyra-fg-secondary hover:text-lyra-fg-default",
        className
      )}
      {...props}
    >
      {icon && (
        <span className={cn("flex-shrink-0 transition-colors", active ? "text-lyra-fg-action" : "text-lyra-fg-disabled group-hover:text-lyra-fg-secondary")}>
          {icon}
        </span>
      )}
      {children}
      {/* Active indicator — blue bar */}
      {active && (
        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-lyra-bg-primary" />
      )}
      {/* Hover indicator — gray bar (only when not active) */}
      {!active && (
        <span className="absolute bottom-0 left-0 right-0 h-[3px] bg-transparent group-hover:bg-lyra-border-medium transition-colors" />
      )}
    </button>
  )
);
Tab.displayName = "Tab";

/* ── Tab Panel (content area) ── */

interface TabPanelProps extends React.HTMLAttributes<HTMLDivElement> {
  active?: boolean;
}

const TabPanel = React.forwardRef<HTMLDivElement, TabPanelProps>(
  ({ className, active, ...props }, ref) => {
    if (!active) return null;
    return (
      <div
        ref={ref}
        role="tabpanel"
        className={cn("flex-1", className)}
        {...props}
      />
    );
  }
);
TabPanel.displayName = "TabPanel";

export { TabList, Tab, TabPanel };
