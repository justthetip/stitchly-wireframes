import Link from "next/link";
import { notFound } from "next/navigation";
import { MoreHorizontal, Sparkles } from "lucide-react";
import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getPattern, projects } from "@/lib/mock-data";
import { PatternArt } from "@/components/craft-art";

export default async function PatternDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const pat = getPattern(id);
  if (!pat) notFound();

  const linkedProjects = projects.filter((p) => p.patternId === id);

  return (
    <div className="flex flex-col pb-6">
      <ScreenHeader
        back="/library"
        title={pat.name}
        right={
          <button className="flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted">
            <MoreHorizontal className="size-5" />
          </button>
        }
      />

      <div className="px-5 pt-5">
        <div className="relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-3xl bg-accent">
          <div className="absolute -right-10 -top-10 size-40 rounded-full bg-[#f58ba2]/60" />
          <PatternArt index={patternsIndex(pat.id)} className="relative size-52" />
        </div>
        <div className="mt-4">
          <h1 className="text-xl font-semibold tracking-tight">{pat.name}</h1>
          <p className="text-sm text-muted-foreground">by {pat.designer}</p>
        </div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          <Badge variant="secondary" className="font-normal">
            {pat.craft}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {pat.difficulty}
          </Badge>
          <Badge variant="secondary" className="font-normal">
            {pat.totalRows} rows
          </Badge>
          <Badge variant="outline" className="font-normal">
            imported {pat.source}
          </Badge>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 px-5">
        <Stat label="Yarn" value={pat.yarn} />
        <Stat label={pat.hook ? "Hook" : "Needle"} value={pat.hook ?? pat.needle ?? "—"} />
      </div>

      <div className="px-5 pt-6">
        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-3.5">
          <div className="flex items-start gap-2.5">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="text-xs leading-relaxed">
              <p className="font-medium text-foreground">
                Pattern parsed from PDF
              </p>
              <p className="mt-0.5 text-muted-foreground">
                {pat.totalRows} rows extracted • 2 flagged as low-confidence.{" "}
                <Link
                  href="/library/upload/review"
                  className="font-medium text-primary"
                >
                  Review parse
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {linkedProjects.length > 0 && (
        <div className="px-5 pt-6">
          <h2 className="mb-2 text-sm font-semibold">
            Your projects from this pattern
          </h2>
          <div className="space-y-2">
            {linkedProjects.map((proj) => (
              <Link
                key={proj.id}
                href={`/projects/${proj.id}`}
                className="flex items-center justify-between rounded-xl border border-border bg-card px-3.5 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{proj.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {proj.status === "active"
                      ? `Row ${proj.currentRow}/${pat.totalRows}`
                      : "Completed"}
                  </p>
                </div>
                <Badge
                  variant={proj.status === "active" ? "default" : "secondary"}
                  className="text-[10px] font-normal"
                >
                  {proj.status}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="px-5 pt-6">
        <Link
          href={`/projects/new?pattern=${pat.id}`}
          className={cn(buttonVariants({ size: "lg" }), "w-full")}
        >
          Start a project
        </Link>
      </div>
    </div>
  );
}

function patternsIndex(id: string) { return ["aran-scarf", "amigurumi-bunny", "ribbed-beanie", "granny-square"].indexOf(id); }

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
