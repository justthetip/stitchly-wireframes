import Link from "next/link";
import { Plus, Search, SlidersHorizontal } from "lucide-react";
import { ScreenHeader } from "@/components/screen-header";
import { Badge } from "@/components/ui/badge";
import { patterns } from "@/lib/mock-data";

export default function LibraryPage() {
  return (
    <div className="flex flex-col pb-4">
      <ScreenHeader
        title="Pattern library"
        right={
          <Link
            href="/library/upload"
            className="flex size-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
            aria-label="Add pattern"
          >
            <Plus className="size-4" />
          </Link>
        }
      />

      <div className="px-5 pt-4">
        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-sm">
            <Search className="size-4 text-muted-foreground" />
            <input
              placeholder="Search patterns, designers…"
              className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
            />
          </div>
          <button
            aria-label="Filters"
            className="flex size-10 shrink-0 items-center justify-center rounded-full border border-border bg-card text-foreground"
          >
            <SlidersHorizontal className="size-4" />
          </button>
        </div>

        <div className="mt-4 flex gap-2 overflow-x-auto pb-1 text-xs">
          {["All", "Knit", "Crochet", "Recent", "Beginner"].map((tag, i) => (
            <span
              key={tag}
              className={
                i === 0
                  ? "rounded-full bg-primary px-3 py-1.5 font-medium text-primary-foreground"
                  : "rounded-full border border-border bg-card px-3 py-1.5 text-muted-foreground"
              }
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-5 pt-5">
        {patterns.map((pat) => (
          <Link
            key={pat.id}
            href={`/library/${pat.id}`}
            className="rounded-xl border border-border bg-card p-3"
          >
            <div className="mb-2 flex aspect-square w-full items-center justify-center rounded-lg bg-accent text-5xl">
              {pat.cover}
            </div>
            <p className="line-clamp-2 text-sm font-semibold leading-tight">
              {pat.name}
            </p>
            <p className="mt-0.5 truncate text-[11px] text-muted-foreground">
              {pat.designer}
            </p>
            <div className="mt-2 flex items-center gap-1">
              <Badge variant="secondary" className="text-[10px] font-normal">
                {pat.craft}
              </Badge>
              <span className="text-[10px] text-muted-foreground">
                {pat.totalRows} rows
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
