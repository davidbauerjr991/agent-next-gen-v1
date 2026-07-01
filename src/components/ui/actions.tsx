import * as React from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Action Icon Button (icon with optional badge) ── */

interface ActionIconButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Badge count — hidden when 0 or undefined */
  badge?: number;
}

const ActionIconButton = React.forwardRef<
  HTMLButtonElement,
  ActionIconButtonProps
>(({ className, badge, children, ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "relative flex h-8 w-8 items-center justify-center rounded-lyra-sm text-lyra-fg-default transition-colors",
      "hover:bg-lyra-state-hover active:bg-lyra-state-pressed",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-focus focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    {children}
    {badge != null && badge > 0 && (
      <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-lyra-bg-destructive px-1 text-[9px] font-bold text-lyra-fg-on-primary">
        {badge}
      </span>
    )}
  </button>
));
ActionIconButton.displayName = "ActionIconButton";

/* ── Action Avatar Button (avatar circle + chevron) ── */

interface ActionAvatarButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** User initials (1-2 characters) */
  initials: string;
  /** Background color for the avatar circle */
  avatarColor?: string;
}

const ActionAvatarButton = React.forwardRef<
  HTMLButtonElement,
  ActionAvatarButtonProps
>(({ className, initials, avatarColor = "#5d6a79", ...props }, ref) => (
  <button
    ref={ref}
    className={cn(
      "inline-flex items-center gap-1 rounded-lyra-sm px-1.5 py-1 transition-colors",
      "hover:bg-lyra-state-hover active:bg-lyra-state-pressed",
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-focus focus-visible:ring-offset-2",
      className
    )}
    {...props}
  >
    <div
      className="flex h-8 w-8 items-center justify-center rounded-full lyra-body-md-emphasis text-white"
      style={{ backgroundColor: avatarColor }}
    >
      {initials}
    </div>
    <ChevronDown
      className="h-3.5 w-3.5 text-lyra-fg-secondary"
      strokeWidth={1.5}
    />
  </button>
));
ActionAvatarButton.displayName = "ActionAvatarButton";

/* ── Re-export old names for backward compat ── */
const ShellIconButton = ActionIconButton;
const ShellAvatarButton = ActionAvatarButton;

export {
  ActionIconButton,
  ActionAvatarButton,
  ShellIconButton,
  ShellAvatarButton,
};
