import * as React from "react";
import { cn } from "@/lib/utils";

/* ── Types ── */

export interface AppMenuItem {
  /** Display label */
  label: string;
  /** Optional icon (rendered as a rounded square placeholder if omitted) */
  icon?: React.ReactNode;
  /** Whether this item is currently active/selected */
  active?: boolean;
  /** Click handler */
  onClick?: () => void;
}

export interface AppMenuGroup {
  items: AppMenuItem[];
}

/* ── AppMenu ── */

interface AppMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Groups of menu items, separated by dividers */
  groups: AppMenuGroup[];
  /** Optional footer content (e.g., logo) */
  footer?: React.ReactNode;
}

const AppMenu = React.forwardRef<HTMLDivElement, AppMenuProps>(
  ({ className, groups, footer, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        "w-[320px] rounded-lyra-lg border border-lyra-border-subtle bg-lyra-bg-surface-overlay shadow-lg",
        "overflow-hidden",
        className
      )}
      {...props}
    >
      <div className="max-h-[480px] overflow-y-auto py-2">
        {groups.map((group, gi) => (
          <React.Fragment key={gi}>
            {gi > 0 && (
              <div className="mx-4 my-1 border-t border-lyra-border-subtle" />
            )}
            <div className="flex flex-col gap-0.5 px-2">
              {group.items.map((item, ii) => (
                <AppMenuItemRow key={ii} item={item} />
              ))}
            </div>
          </React.Fragment>
        ))}
      </div>

      {/* Footer (logo) */}
      {footer && (
        <>
          <div className="mx-4 border-t border-lyra-border-subtle" />
          <div className="flex items-center justify-center px-4 py-3">
            {footer}
          </div>
        </>
      )}
    </div>
  )
);
AppMenu.displayName = "AppMenu";

/* ── AppMenuItemRow (internal) ── */

function AppMenuItemRow({ item }: { item: AppMenuItem }) {
  return (
    <button
      onClick={item.onClick}
      className={cn(
        "flex w-full items-center gap-3 rounded-lyra-md px-3 py-2 text-left lyra-body-md transition-colors",
        item.active
          ? "bg-lyra-bg-active-subtle text-lyra-fg-active-strong lyra-body-md-emphasis"
          : "text-lyra-fg-default hover:bg-lyra-state-hover active:bg-lyra-state-pressed"
      )}
    >
      {/* Icon or placeholder */}
      {item.icon ? (
        <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
          {item.icon}
        </span>
      ) : (
        <span className="h-8 w-8 flex-shrink-0 rounded-lyra-sm bg-lyra-bg-surface-shell" />
      )}
      <span className="truncate">{item.label}</span>
    </button>
  );
}

export { AppMenu };
