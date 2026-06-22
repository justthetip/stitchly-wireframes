import Link from "next/link";
import { Plus } from "lucide-react";
import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { projects, getPattern } from "@/lib/mock-data";

export default function ProjectsPage() {
  const active = projects.filter((p) => p.status === "active");
  const completed = projects.filter((p) => p.status === "completed");

  return (
    <div className="flex flex-col pb-4">
      <ScreenHeader
        title="Your projects"
        right={
          <Link
            href="/projects/new"
            className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-label="New project"
          >
            <Plus className="size-4" />
          </Link>
        }
      />

      <Section title="Active" count={active.length}>
        {active.map((p) => {
          const pat = getPattern(p.patternId);
          if (!pat) return null;
          const pct = Math.round((p.currentRow / pat.totalRows) * 100);
          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="block rounded-xl border border-border bg-card p-3.5"
            >
              <div className="flex items-center gap-3">
                <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent text-2xl">
                  {pat.cover}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">
                    {pat.name}
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums">
                  {pct}%
                </span>
              </div>
              <div className="mt-2.5 flex items-center gap-2">
                <Progress value={pct} className="h-1.5" />
                <span className="shrink-0 text-[10px] text-muted-foreground">
                  Row {p.currentRow}/{pat.totalRows}
                </span>
              </div>
            </Link>
          );
        })}
      </Section>

      <Section title="Completed" count={completed.length}>
        {completed.map((p) => {
          const pat = getPattern(p.patternId);
          if (!pat) return null;
          return (
            <Link
              key={p.id}
              href={`/projects/${p.id}`}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-3 opacity-80"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-xl">
                {pat.cover}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{p.name}</p>
                <p className="text-[11px] text-muted-foreground">
                  Finished May 2026
                </p>
              </div>
              <Badge variant="secondary" className="font-normal">
                done
              </Badge>
            </Link>
          );
        })}
      </Section>
    </div>
  );
}

function Section({
  title,
  count,
  children,
}: {
  title: string;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <section className="px-5 pt-5">
      <div className="mb-2 flex items-baseline gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <span className="text-xs text-muted-foreground">{count}</span>
      </div>
      <div className="space-y-2">{children}</div>
    </section>
  );
}
