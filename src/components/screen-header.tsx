import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export function ScreenHeader({
  title,
  back,
  right,
  subtitle,
  className,
}: {
  title?: React.ReactNode;
  back?: string;
  right?: React.ReactNode;
  subtitle?: React.ReactNode;
  className?: string;
}) {
  return (
    <header
      className={cn(
        "sticky top-0 z-20 flex items-center justify-between gap-3 border-b border-border/70 bg-background/90 px-5 py-4 backdrop-blur-xl md:px-8",
        className
      )}
    >
      <div className="flex items-center gap-2 min-w-0 flex-1">
        {back && (
          <Link
            href={back}
            className="-ml-2 flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
            aria-label="Back"
          >
            <ChevronLeft className="size-5" />
          </Link>
        )}
        <div className="min-w-0">
          {title && (
            <h1 className="font-heading truncate text-lg font-extrabold tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="truncate text-xs text-muted-foreground">{subtitle}</p>
          )}
        </div>
      </div>
      {right && <div className="flex shrink-0 items-center gap-1">{right}</div>}
    </header>
  );
}
