import cxoneLogo from "@/assets/cxone-logo.svg";
import { cn } from "@/lib/utils";

interface CXoneLogoProps extends React.HTMLAttributes<HTMLDivElement> {}

/**
 * NICE CXone wordmark logo.
 */
export function CXoneLogo({ className, ...props }: CXoneLogoProps) {
  return (
    <div className={cn("inline-flex items-center", className)} {...props}>
      <img src={cxoneLogo} alt="NICE CXone" className="h-4" />
    </div>
  );
}
