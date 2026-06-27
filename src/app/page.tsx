import Link from "next/link";
import { ChevronRight, Plus } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { patterns, projects, getPattern } from "@/lib/mock-data";

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  // Wireframe-only: ?empty previews the no-projects state, ?empty=new the
  // brand-new-user state (no patterns either). Toggle lives at the bottom.
  const view = empty === undefined ? "populated" : empty === "new" ? "new" : "projects";
  const forceEmpty = view !== "populated";
  const hasPatterns = view === "new" ? false : patterns.length > 0;

  const active = forceEmpty ? [] : projects.filter((p) => p.status === "active");
  const current = active[0];
  const currentPattern = current && getPattern(current.patternId);

  return (
    <div className="flex flex-col">
      {/* Greeting header */}
      <div className="px-5 pt-6 pb-4">
        <p className="text-xs uppercase tracking-wider text-muted-foreground">
          Saturday afternoon
        </p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          Hello, Melissa
        </h1>
      </div>

      {active.length === 0 && <HomeEmptyState hasPatterns={hasPatterns} />}

      {/* Continue making — hero */}
      {current && currentPattern && (
        <section className="px-5">
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Continue making
          </p>
          <Link
            href={`/projects/${current.id}/reader`}
            className="block overflow-hidden rounded-2xl border border-border bg-card transition active:scale-[0.99]"
          >
            <div className="flex items-center gap-4 p-4">
              <div className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-accent text-3xl">
                {currentPattern.cover}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold">{current.name}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Row {current.currentRow} of {currentPattern.totalRows}
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Progress
                    value={(current.currentRow / currentPattern.totalRows) * 100}
                    className="h-1.5"
                  />
                  <span className="text-[11px] font-medium tabular-nums text-muted-foreground">
                    {Math.round(
                      (current.currentRow / currentPattern.totalRows) * 100
                    )}
                    %
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-border bg-primary/5 px-4 py-2.5 text-xs">
              <span className="text-muted-foreground">
                Last worked Friday evening
              </span>
              <span className="flex items-center gap-1 font-medium text-primary">
                Pick up where you left off
                <ChevronRight className="size-3.5" />
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* Active projects */}
      {active.length > 0 && (
      <section className="px-5 pt-6 pb-6">
        <div className="mb-2 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold">Active projects</h2>
          <Link
            href="/projects"
            className="text-xs font-medium text-primary"
          >
            See all
          </Link>
        </div>
        <div className="space-y-2">
          {active.map((p) => {
            const pat = getPattern(p.patternId);
            if (!pat) return null;
            const pct = Math.round((p.currentRow / pat.totalRows) * 100);
            return (
              <Link
                key={p.id}
                href={`/projects/${p.id}`}
                className="flex items-center gap-3 rounded-xl border border-border bg-card p-3"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                  {pat.cover}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{p.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    Row {p.currentRow}/{pat.totalRows} • {pat.craft}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold tabular-nums">{pct}%</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
      )}

      <PreviewToggle current={view} />
    </div>
  );
}

function PreviewToggle({
  current,
}: {
  current: "populated" | "projects" | "new";
}) {
  const options = [
    { key: "populated", label: "Populated", href: "/" },
    { key: "projects", label: "No projects", href: "/?empty" },
    { key: "new", label: "New user", href: "/?empty=new" },
  ] as const;
  return (
    <div className="mt-2 border-t border-dashed border-border px-5 py-4">
      <p className="mb-1.5 text-[10px] uppercase tracking-wider text-muted-foreground">
        Preview state · wireframe only
      </p>
      <div className="inline-flex rounded-full border border-border bg-muted p-0.5 text-[11px] font-medium">
        {options.map((o) => (
          <Link
            key={o.key}
            href={o.href}
            className={cn(
              "rounded-full px-3 py-1 transition",
              current === o.key
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground"
            )}
          >
            {o.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function HomeEmptyState({ hasPatterns }: { hasPatterns: boolean }) {
  return (
    <section className="px-5 pt-2 pb-6">
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-10 text-center">
        <div className="flex size-16 items-center justify-center rounded-2xl bg-accent text-3xl">
          🧶
        </div>
        <h2 className="mt-4 text-base font-semibold">
          Nothing on the needles yet
        </h2>
        <p className="mt-1.5 max-w-[16rem] text-sm text-muted-foreground">
          {hasPatterns
            ? "Pick a pattern from your library and start a project — your rows, notes and progress all live here."
            : "Add your first pattern, then start a project. We’ll keep your place so you can pick up right where you left off."}
        </p>
        <Link
          href={hasPatterns ? "/projects/new" : "/library/upload"}
          className={buttonVariants({ size: "lg", className: "mt-5 w-full" })}
        >
          <Plus className="size-4" />
          {hasPatterns ? "Start a project" : "Add a pattern"}
        </Link>
        {hasPatterns && (
          <Link
            href="/library"
            className="mt-3 text-xs font-medium text-primary"
          >
            Browse your library
          </Link>
        )}
      </div>
    </section>
  );
}
