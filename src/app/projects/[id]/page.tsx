import Link from "next/link";
import { notFound } from "next/navigation";
import { NotebookPen, Play, ArrowRight } from "lucide-react";
import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Progress } from "@/components/ui/progress";
import { getProject, getPattern } from "@/lib/mock-data";
import { PatternArt } from "@/components/craft-art";

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const proj = getProject(id);
  if (!proj) notFound();
  const pat = getPattern(proj.patternId);
  if (!pat) notFound();
  const pct = Math.round((proj.currentRow / pat.totalRows) * 100);

  return (
    <div className="flex flex-col pb-6">
      <ScreenHeader back="/projects" title={proj.name} />

      <div className="px-5 pt-5">
        <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-3xl bg-[#ffe6a8]">
          <div className="stitch-pattern absolute inset-0 opacity-30" />
          <PatternArt index={proj.patternId === "aran-scarf" ? 0 : 1} className="size-52" />
        </div>

        <div className="mt-4">
          <Link
            href={`/library/${pat.id}`}
            className="text-xs font-medium text-primary"
          >
            {pat.name} →
          </Link>
          <h1 className="font-heading mt-1 text-2xl font-black tracking-tight">
            {proj.name}
          </h1>
        </div>

        <div className="stitch-card mt-4 p-5">
          <div className="flex items-baseline justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              Progress
            </p>
            <p className="text-sm font-semibold tabular-nums">{pct}%</p>
          </div>
          <Progress value={pct} className="mt-2 h-2" />
          <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
            <span>
              Row {proj.currentRow} of {pat.totalRows}
            </span>
            <span>Updated 21 June</span>
          </div>
          <Link
            href={`/projects/${proj.id}/reader`}
            className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full")}
          >
            <Play className="mr-2 size-4" />
            Continue from row {proj.currentRow}
          </Link>
        </div>
      </div>

      <section className="px-5 pt-6">
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Notes</h2>
          <Link href={`/projects/${proj.id}/reader`} className="flex items-center gap-1 text-xs font-bold text-primary">
            <NotebookPen className="size-3.5" />
            Add in reader <ArrowRight className="size-3"/>
          </Link>
        </div>
        {proj.notes.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border bg-card p-4 text-xs text-muted-foreground">
            No notes yet. Tap a row in the reader to add a note against it.
          </p>
        ) : (
          <div className="space-y-2">
            {proj.notes.map((n, i) => (
              <div
                key={i}
                className="rounded-xl border border-border bg-card p-3"
              >
                <p className="text-xs leading-relaxed">{n}</p>
                <p className="mt-1.5 text-[10px] text-muted-foreground">
                  Row 30 • 16 June
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="px-5 pt-6">
        <h2 className="mb-2 text-sm font-semibold">Materials</h2>
        <div className="grid grid-cols-2 gap-2">
          <Stat label="Yarn" value={pat.yarn} />
          <Stat label={pat.hook ? "Hook" : "Needle"} value={pat.hook ?? pat.needle ?? "—"} />
        </div>
      </section>

      <section className="px-5 pt-6">
        <h2 className="mb-2 text-sm font-semibold">Details</h2>
        <div className="flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="font-normal">
            {pat.craft}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {pat.difficulty}
          </Badge>
          <Badge variant="outline" className="font-normal">
            started {proj.startedAt}
          </Badge>
        </div>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-3">
      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="mt-0.5 text-sm font-medium leading-snug">{value}</p>
    </div>
  );
}
