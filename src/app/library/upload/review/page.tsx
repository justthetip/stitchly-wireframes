"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertTriangle, Check, FileText, Pencil, Sparkles, Plus } from "lucide-react";
import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { sampleParsed, type ParsedRow } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

export default function ReviewParsePage() {
  const [rows, setRows] = useState<ParsedRow[]>(sampleParsed);
  const [editing, setEditing] = useState<number | null>(null);
  const [saved, setSaved] = useState(false);

  const lowCount = rows.filter((r) => r.confidence === "low").length;
  const medCount = rows.filter((r) => r.confidence === "medium").length;

  return (
    <div className="flex flex-col pb-32 md:px-3">
      <ScreenHeader
        back="/library/upload"
        title="Review parsed rows"
        subtitle={`${rows.length} rows extracted`}
      />

      {/* Source preview strip */}
      <div className="border-b border-border bg-muted/40 px-5 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex size-9 items-center justify-center rounded-lg bg-card text-foreground">
            <FileText className="size-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium">
              pocket-bunny-amigurumi.pdf
            </p>
            <p className="text-[10px] text-muted-foreground">
              Tap any row to compare with the original
            </p>
          </div>
        </div>
      </div>

      {/* Summary banner */}
      <div className="px-5 pt-4">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
          <div className="flex items-start gap-2.5">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <div className="text-xs leading-relaxed">
              <p className="font-medium">Parse looks good overall</p>
              <p className="mt-0.5 text-muted-foreground">
                {rows.length - lowCount - medCount} rows high-confidence,{" "}
                {medCount} medium, <span className="text-primary">{lowCount} need a look</span>.
                You can edit anything before saving.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-2 px-5 pt-4">
        {rows.map((row, i) => (
          <RowCard
            key={row.n}
            row={row}
            isEditing={editing === row.n}
            onEdit={() => setEditing(editing === row.n ? null : row.n)}
            onChange={(next) => {
              setRows((prev) => prev.map((r, j) => (j === i ? next : r)));
            }}
          />
        ))}
      </div>

      <div className="px-5 pt-4">
        <button onClick={() => setRows(current => [...current, { n: current.length + 1, instructions: "Add the missing instruction", confidence: "medium" }])} className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-primary/25 bg-card px-3 py-3 text-xs font-extrabold text-primary hover:bg-primary/5">
          <Plus className="size-4"/> Add a missing row
        </button>
      </div>

      {/* Sticky save bar */}
      <div className="absolute bottom-16 left-0 right-0 border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
        <div className="flex gap-2">
          <Link
            href="/library"
            className={cn(buttonVariants({ variant: "outline", size: "lg" }), "flex-1")}
          >
            Cancel
          </Link>
          {saved ? <Link href="/library" className={cn(buttonVariants({ size: "lg" }), "flex-1 bg-[#2e6b46]")}>Open your library</Link> : <button onClick={()=>{let name="Imported pattern.pdf";const upload=sessionStorage.getItem("stitchly:last-upload");if(upload){try{name=JSON.parse(upload).name}catch{}}localStorage.setItem("stitchly:saved-pattern",JSON.stringify({name,savedAt:new Date().toISOString()}));setSaved(true)}} className={cn(buttonVariants({ size: "lg" }), "flex-1")}>Save pattern</button>}
        </div>
        <p className="mt-1.5 text-center text-[10px] text-muted-foreground">
          You can fix rows later from the pattern detail screen
        </p>
      </div>
    </div>
  );
}

function RowCard({
  row,
  isEditing,
  onEdit,
  onChange,
}: {
  row: ParsedRow;
  isEditing: boolean;
  onEdit: () => void;
  onChange: (next: ParsedRow) => void;
}) {
  const conf = row.confidence;
  const isLow = conf === "low";
  return (
    <div
      className={cn(
        "rounded-xl border bg-card p-3.5",
        isLow ? "border-amber-300 bg-amber-50/40" : "border-border"
      )}
    >
      <div className="mb-1.5 flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Row {row.n}
        </span>
        {row.section && (
          <Badge variant="secondary" className="text-[10px] font-normal">
            {row.section}
          </Badge>
        )}
        <ConfidenceChip conf={conf} />
        <button
          onClick={onEdit}
          className="ml-auto flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Edit row"
        >
          <Pencil className="size-3.5" />
        </button>
      </div>

      {isEditing ? (
        <textarea
          value={row.instructions}
          onChange={(e) => onChange({ ...row, instructions: e.target.value })}
          rows={3}
          className="w-full resize-none rounded-lg border border-border bg-background p-2 text-sm leading-relaxed outline-none focus:border-primary"
        />
      ) : (
        <p className="text-sm leading-relaxed">{row.instructions}</p>
      )}

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {row.stitchCount != null ? `${row.stitchCount} sts` : "—"}
        </span>
        {isLow && (
          <span className="flex items-center gap-1 text-amber-700">
            <AlertTriangle className="size-3" />
            Couldn&apos;t read this row clearly
          </span>
        )}
      </div>
    </div>
  );
}

function ConfidenceChip({ conf }: { conf: ParsedRow["confidence"] }) {
  if (conf === "high")
    return (
      <span className="flex items-center gap-0.5 rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-medium text-emerald-700">
        <Check className="size-2.5" strokeWidth={3} />
        High
      </span>
    );
  if (conf === "medium")
    return (
      <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-medium text-amber-700">
        Medium
      </span>
    );
  return (
    <span className="flex items-center gap-0.5 rounded-full bg-amber-200 px-1.5 py-0.5 text-[10px] font-medium text-amber-900">
      <AlertTriangle className="size-2.5" />
      Low
    </span>
  );
}
