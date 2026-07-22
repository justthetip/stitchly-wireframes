"use client";

import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Eye,
  NotebookPen,
  X,
} from "lucide-react";
import { notFound } from "next/navigation";
import { getProject, getPattern, aranScarfRows } from "@/lib/mock-data";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { loadProgress, saveProgress } from "@/lib/persistence";

export default function ReaderPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const proj = getProject(id);
  if (!proj) notFound();
  const pat = getPattern(proj.patternId);
  if (!pat) notFound();

  // Use real parsed rows where we have them; pad with placeholders otherwise.
  const rows = useMemo(() => Array.from({ length: pat.totalRows }, (_, index) => {
    const source = aranScarfRows[index % aranScarfRows.length];
    return { ...source, n: index + 1, section: index % 8 === 0 ? (index === 0 ? "Set-up" : `Repeat ${Math.floor(index / 8)}`) : undefined };
  }), [pat.totalRows]);

  const [rowIndex, setRowIndex] = useState(
    Math.min(proj.currentRow - 1, rows.length - 1)
  );
  const [noteOpen, setNoteOpen] = useState(false);
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<Record<number, string>>({});
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      const saved = loadProgress(proj.id, proj.currentRow);
      setRowIndex(Math.min(saved.row - 1, rows.length - 1));
      setNotes(saved.notes);
      setHydrated(true);
    }, 0);
    return () => window.clearTimeout(timer);
  }, [proj.id, proj.currentRow, rows.length]);
  useEffect(() => { if (hydrated) saveProgress(proj.id, { row: rowIndex + 1, notes }); }, [hydrated, notes, proj.id, rowIndex]);

  const row = rows[rowIndex];
  const prev = rowIndex > 0 ? rows[rowIndex - 1] : null;
  const next = rowIndex < rows.length - 1 ? rows[rowIndex + 1] : null;
  const pct = Math.round(((rowIndex + 1) / pat.totalRows) * 100);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-3rem)] max-w-3xl flex-col bg-background">
      {/* Top bar */}
      <header className="flex items-center justify-between border-b border-border/70 bg-white/70 px-3 py-3 backdrop-blur">
        <Link
          href={`/projects/${proj.id}`}
          className="-ml-1 flex size-9 items-center justify-center rounded-full text-foreground hover:bg-muted"
          aria-label="Close reader"
        >
          <X className="size-5" />
        </Link>
        <div className="text-center">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {proj.name}
          </p>
          <p className="font-heading text-sm font-extrabold">
            Row {row.n} of {pat.totalRows}
          </p>
        </div>
        <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-[10px] font-black">{pct}%</span>
      </header>

      {/* Progress */}
      <div className="px-5 pt-3">
        <Progress value={pct} className="h-1" />
        <div className="mt-1.5 flex items-center justify-between text-[10px] text-muted-foreground">
          <span>Start</span>
          <span className="font-medium tabular-nums">{pct}%</span>
          <span>Done</span>
        </div>
      </div>

      {/* Section label */}
      {row.section && (
        <p className="px-5 pt-5 text-[10px] font-semibold uppercase tracking-widest text-primary">
          {row.section}
        </p>
      )}

      {/* Previous-row peek */}
      {prev && (
        <div className="mx-5 mt-2 rounded-xl border border-dashed border-border bg-card/50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Just done — Row {prev.n}
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {prev.instructions}
          </p>
        </div>
      )}

      {/* Current row — the focus */}
      <div className="flex flex-1 flex-col items-stretch justify-center px-5 py-4">
        <div className="stitch-card relative overflow-hidden p-6 md:p-8">
          <div className="absolute right-0 top-0 h-full w-2 bg-[#f5a623]" />
          <div className="flex items-baseline justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-widest text-primary">
              Row {row.n}
            </p>
            {row.stitchCount != null && (
              <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium tabular-nums text-muted-foreground">
                {row.stitchCount} sts expected
              </span>
            )}
          </div>
          <p className="font-heading mt-4 text-2xl font-extrabold leading-relaxed tracking-tight md:text-3xl">
            {row.instructions}
          </p>

          <div className="mt-4 flex items-center gap-2">
            <button
              onClick={() => { setNoteText(notes[row.n] ?? ""); setNoteOpen(true); }}
              className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground"
            >
              <NotebookPen className="size-3.5" />
              {notes[row.n] ? "Edit note" : "Add note"}
            </button>
            <button className="flex items-center gap-1.5 rounded-full border border-border bg-background px-3 py-1.5 text-[11px] font-medium text-muted-foreground hover:text-foreground">
              <Eye className="size-3.5" />
              View original
            </button>
          </div>
        </div>
      </div>

      {/* Next-row peek */}
      {next && (
        <div className="mx-5 mb-3 rounded-xl border border-dashed border-border bg-card/50 p-3">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Coming up — Row {next.n}
          </p>
          <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
            {next.instructions}
          </p>
        </div>
      )}

      {/* Sticky action bar */}
      <div className="sticky bottom-0 border-t border-border bg-background/95 px-3 py-3 backdrop-blur">
        <div className="flex items-stretch gap-2">
          <button
            onClick={() => setRowIndex((i) => Math.max(0, i - 1))}
            disabled={!prev}
            className={cn(
              "flex w-14 items-center justify-center rounded-xl border border-border bg-card",
              !prev && "opacity-40"
            )}
            aria-label="Previous row"
          >
            <ChevronLeft className="size-5" />
          </button>
          <Button
            onClick={() => setRowIndex((i) => Math.min(rows.length - 1, i + 1))}
            disabled={!next}
            size="lg"
            className="flex-1"
          >
            <Check className="mr-2 size-4" strokeWidth={3} />
            Done — next row
            <ChevronRight className="ml-1 size-4" />
          </Button>
        </div>
        <p className="mt-2 text-center text-[10px] text-muted-foreground">
          Progress saves automatically
        </p>
      </div>

      {/* Add-note sheet */}
      <Sheet open={noteOpen} onOpenChange={setNoteOpen}>
        <SheetContent side="bottom" className="rounded-t-2xl">
          <SheetHeader>
            <SheetTitle>Note on row {row.n}</SheetTitle>
            <SheetDescription>
              Something to remember about this row — modifications, hook
              changes, anything.
            </SheetDescription>
          </SheetHeader>
          <div className="px-4">
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="e.g. Used 5mm hook for this section"
              rows={4}
              className="w-full resize-none rounded-lg border border-border bg-background p-3 text-sm leading-relaxed outline-none focus:border-primary"
            />
          </div>
          <SheetFooter>
            <Button
              onClick={() => {
                setNotes((current) => ({ ...current, [row.n]: noteText }));
                setNoteText("");
                setNoteOpen(false);
              }}
            >
              Save note
            </Button>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </div>
  );
}
