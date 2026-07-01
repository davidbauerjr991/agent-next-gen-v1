import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { Check, Minus } from "lucide-react";
import { cn } from "@/lib/utils";

interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root> {
  /** Show error/destructive styling */
  error?: boolean;
}

const Checkbox = React.forwardRef<
  React.ComponentRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, error, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 rounded-lyra-xs border-[1.5px] transition-colors",
      /* Unchecked default */
      error
        ? "border-lyra-status-critical-strong bg-lyra-bg-control"
        : "border-lyra-border-default bg-lyra-bg-control",
      /* Unchecked hover/pressed */
      error
        ? "hover:border-lyra-status-critical-strong active:border-lyra-status-critical-strong active:bg-lyra-state-pressed"
        : "hover:border-lyra-border-strong active:border-lyra-border-strong active:bg-lyra-state-pressed",
      /* Focus */
      "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lyra-border-focus focus-visible:ring-offset-2",
      /* Disabled */
      "disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-lyra-border-default",
      /* Checked */
      error
        ? [
            "data-[state=checked]:bg-lyra-bg-destructive data-[state=checked]:border-lyra-bg-destructive data-[state=checked]:text-lyra-fg-on-primary",
            "data-[state=checked]:hover:bg-lyra-state-hover-destructive data-[state=checked]:hover:border-lyra-state-hover-destructive",
            "data-[state=checked]:active:bg-lyra-state-pressed-destructive data-[state=checked]:active:border-lyra-state-pressed-destructive",
          ]
        : [
            "data-[state=checked]:bg-lyra-bg-primary data-[state=checked]:border-lyra-bg-primary data-[state=checked]:text-lyra-fg-on-primary",
            "data-[state=checked]:hover:bg-lyra-state-hover-primary data-[state=checked]:hover:border-lyra-state-hover-primary",
            "data-[state=checked]:active:bg-lyra-state-pressed-primary data-[state=checked]:active:border-lyra-state-pressed-primary",
          ],
      /* Indeterminate */
      error
        ? [
            "data-[state=indeterminate]:bg-lyra-bg-destructive data-[state=indeterminate]:border-lyra-bg-destructive data-[state=indeterminate]:text-lyra-fg-on-primary",
            "data-[state=indeterminate]:hover:bg-lyra-state-hover-destructive data-[state=indeterminate]:hover:border-lyra-state-hover-destructive",
            "data-[state=indeterminate]:active:bg-lyra-state-pressed-destructive data-[state=indeterminate]:active:border-lyra-state-pressed-destructive",
          ]
        : [
            "data-[state=indeterminate]:bg-lyra-bg-primary data-[state=indeterminate]:border-lyra-bg-primary data-[state=indeterminate]:text-lyra-fg-on-primary",
            "data-[state=indeterminate]:hover:bg-lyra-state-hover-primary data-[state=indeterminate]:hover:border-lyra-state-hover-primary",
            "data-[state=indeterminate]:active:bg-lyra-state-pressed-primary data-[state=indeterminate]:active:border-lyra-state-pressed-primary",
          ],
      className
    )}
    {...props}
  >
    <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
      {props.checked === "indeterminate" ? (
        <Minus className="h-3 w-3" strokeWidth={3} />
      ) : (
        <Check className="h-3 w-3" strokeWidth={3} />
      )}
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));
Checkbox.displayName = CheckboxPrimitive.Root.displayName;

export { Checkbox };
