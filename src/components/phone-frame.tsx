import { BottomNav } from "./bottom-nav";

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex min-h-dvh max-w-[1400px] flex-col items-center justify-start gap-6 px-4 py-6 md:py-10 lg:flex-row lg:items-start lg:justify-center lg:gap-12">
      {/* Sidebar label on desktop */}
      <aside className="hidden lg:block lg:w-72 lg:pt-12">
        <div className="space-y-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-2 text-foreground">
            <span className="inline-block size-2 rounded-full bg-primary" />
            <span className="font-medium tracking-tight">Stitchly</span>
            <span className="text-xs text-muted-foreground">wireframes</span>
          </div>
          <p className="leading-relaxed">
            Throwaway clickable prototype to clarify MVP scope. Mid-fi — not
            final design. Tap anywhere to navigate.
          </p>
          <p className="leading-relaxed text-xs">
            Best viewed at mobile width. Resize the window or open on your
            phone for the real feel.
          </p>
        </div>
      </aside>

      {/* The phone */}
      <div className="relative w-full max-w-[420px] flex-shrink-0">
        <div className="relative overflow-hidden rounded-[2.25rem] border border-border bg-background shadow-2xl shadow-black/10 ring-1 ring-black/5 md:rounded-[2.5rem]">
          {/* Status bar */}
          <div className="flex items-center justify-between px-7 pt-3 pb-1 text-[11px] font-medium text-foreground/80">
            <span>9:41</span>
            <span className="flex items-center gap-1">
              <span className="size-1 rounded-full bg-foreground/70" />
              <span className="size-1 rounded-full bg-foreground/70" />
              <span className="size-1 rounded-full bg-foreground/70" />
              <span className="ml-1">•••</span>
            </span>
          </div>

          {/* Screen content */}
          <div className="flex h-[760px] flex-col overflow-hidden">
            <div className="flex-1 overflow-y-auto pb-24">{children}</div>
            <BottomNav />
          </div>
        </div>

        {/* Caption under phone */}
        <p className="mt-3 text-center text-xs text-muted-foreground lg:hidden">
          Stitchly wireframes — throwaway prototype
        </p>
      </div>
    </div>
  );
}
