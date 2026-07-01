import * as React from "react";
import { useState, useRef, useCallback } from "react";
import {
  ChevronDown,
  ChevronUp,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Types ── */

export interface NavChild {
  label: string;
  active?: boolean;
  onClick?: () => void;
}

export interface NavItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  expandable?: boolean;
  defaultOpen?: boolean;
  children?: NavChild[];
  onClick?: () => void;
}

/* ── LeftNav ── */

interface LeftNavProps extends React.HTMLAttributes<HTMLElement> {
  /** Navigation items to render */
  items: NavItem[];
  /** Whether the nav is expanded or collapsed */
  open?: boolean;
  /** Called when the toggle button is clicked */
  onToggle?: () => void;
  /** Show/hide the collapse toggle button */
  collapsible?: boolean;
  /**
   * Overlay mode (narrow screens): the aside keeps a fixed 52px footprint;
   * the expanded panel slides out as an absolutely-positioned overlay.
   */
  overlay?: boolean;
  /** Content pinned to the bottom of the nav rail (e.g. an AddChannel button) */
  footer?: React.ReactNode;
}

const LeftNav = React.forwardRef<HTMLElement, LeftNavProps>(
  (
    {
      className,
      items,
      open = true,
      onToggle,
      collapsible = true,
      overlay = false,
      footer,
      ...props
    },
    ref
  ) => {
    // Hover-open state used in overlay mode
    const [hoverOpen, setHoverOpen] = useState(false);
    const hoverTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    const onHoverStart = useCallback(() => {
      clearTimeout(hoverTimer.current);
      setHoverOpen(true);
    }, []);
    const onHoverEnd = useCallback(() => {
      hoverTimer.current = setTimeout(() => setHoverOpen(false), 300);
    }, []);

    const toggleButton = collapsible ? (
      <button
        onClick={onToggle}
        className="absolute -right-3 top-[22px] z-10 flex h-5 w-5 items-center justify-center rounded-full border border-lyra-border-default bg-lyra-bg-surface-base text-lyra-fg-secondary shadow-sm hover:bg-lyra-bg-surface-shell transition-colors"
        title={open ? "Collapse sidebar" : "Expand sidebar"}
      >
        {open ? (
          <ChevronLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
        ) : (
          <ChevronRight className="h-3.5 w-3.5" strokeWidth={1.5} />
        )}
      </button>
    ) : null;

    /* ── Overlay mode (narrow screens): hover to open, no toggle button ── */
    if (overlay) {
      return (
        <aside
          ref={ref}
          className={cn("relative flex-shrink-0 overflow-visible bg-lyra-bg-surface-shell w-[52px]", className)}
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          {...props}
        >
          {/* Sliding panel: 52px footprint when closed, 256px overlay when open */}
          <div
            className="absolute left-0 top-0 bottom-0 flex flex-col bg-lyra-bg-surface-shell overflow-hidden"
            style={{
              width: hoverOpen ? 256 : 52,
              zIndex: hoverOpen ? 20 : 10,
              transition: "width 200ms cubic-bezier(0.4, 0, 0.2, 1)",
              boxShadow: hoverOpen ? "4px 0 12px rgba(0,0,0,0.1)" : "none",
            }}
          >
            <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2 py-3">
              {items.map((item, i) => (
                <NavItemRow key={i} item={item} collapsed={!hoverOpen} />
              ))}
            </nav>
            {footer && (
              <div className="flex-shrink-0 flex items-center justify-center px-2 pb-3">
                {React.isValidElement(footer)
                  ? React.cloneElement(footer as React.ReactElement<{ expanded?: boolean }>, { expanded: hoverOpen })
                  : footer}
              </div>
            )}
          </div>
        </aside>
      );
    }

    /* ── Default (inline) mode ── */
    return (
      <aside
        ref={ref}
        className={cn(
          "relative flex flex-shrink-0 flex-col overflow-visible bg-lyra-bg-surface-shell transition-all duration-200",
          open ? "w-[256px]" : "w-[52px]",
          className
        )}
        {...props}
      >
        {toggleButton}
        <nav className="flex flex-1 flex-col gap-0.5 overflow-y-auto overflow-x-hidden px-2 py-3">
          {items.map((item, i) => (
            <NavItemRow key={i} item={item} collapsed={!open} />
          ))}
        </nav>
        {footer && (
          <div className="flex-shrink-0 flex items-center justify-center px-2 pb-3">
            {footer}
          </div>
        )}
      </aside>
    );
  }
);
LeftNav.displayName = "LeftNav";

/* ── NavItemRow (internal) ── */

function NavItemRow({
  item,
  collapsed,
}: {
  item: NavItem;
  collapsed: boolean;
}) {
  const [open, setOpen] = useState(item.defaultOpen ?? false);
  const hasChildren = item.children && item.children.length > 0;
  const isActive =
    item.active || (hasChildren && item.children!.some((c) => c.active));

  return (
    <div>
      <button
        onClick={() => {
          if (item.expandable && !collapsed) setOpen((v) => !v);
          item.onClick?.();
        }}
        title={collapsed ? item.label : undefined}
        className={cn(
          "flex w-full items-center gap-2.5 rounded-lyra-sm px-2.5 py-[7px] lyra-body-md transition-colors",
          collapsed && "justify-center px-0",
          isActive
            ? "bg-lyra-fg-active-subtle text-lyra-fg-active-strong lyra-body-md-emphasis"
            : "text-lyra-fg-default hover:bg-lyra-state-hover active:bg-lyra-state-pressed"
        )}
      >
        <span className="flex-shrink-0 text-lyra-fg-secondary">
          {item.icon}
        </span>
        {!collapsed && (
          <>
            <span className="flex-1 text-left truncate">{item.label}</span>
            {item.expandable && (
              <span className="text-lyra-fg-disabled">
                {open ? (
                  <ChevronUp className="h-3.5 w-3.5" strokeWidth={1.5} />
                ) : (
                  <ChevronDown className="h-3.5 w-3.5" strokeWidth={1.5} />
                )}
              </span>
            )}
          </>
        )}
      </button>

      {/* Children (expanded) — hidden when collapsed */}
      {!collapsed && hasChildren && open && (
        <div className="ml-[18px] mt-0.5 flex flex-col gap-0.5 border-l border-lyra-border-subtle pl-3">
          {item.children!.map((child, j) => (
            <button
              key={j}
              onClick={child.onClick}
              className={cn(
                "w-full rounded-lyra-sm px-2.5 py-[6px] text-left lyra-body-md transition-colors",
                child.active
                  ? "bg-lyra-fg-active-subtle text-lyra-fg-active-strong lyra-body-md-emphasis"
                  : "text-lyra-fg-secondary hover:bg-lyra-state-hover hover:text-lyra-fg-default active:bg-lyra-state-pressed"
              )}
            >
              {child.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export { LeftNav };
