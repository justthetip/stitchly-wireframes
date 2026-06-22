"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { FileUp, Camera, Globe, Sparkles } from "lucide-react";
import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";

export default function UploadPage() {
  const router = useRouter();
  const [file, setFile] = useState<string | null>(null);

  return (
    <div className="flex flex-col pb-6">
      <ScreenHeader back="/library" title="Add a pattern" />

      <div className="px-5 pt-5">
        <p className="text-sm text-muted-foreground">
          Drop in a PDF — Stitchly breaks it into row-by-row steps you can
          follow on the go. You&apos;ll get to review the parse before saving.
        </p>
      </div>

      <div className="px-5 pt-5">
        <button
          onClick={() => setFile("aran-cable-scarf-v2.pdf")}
          className="block w-full rounded-2xl border-2 border-dashed border-border bg-card px-6 py-10 text-center transition hover:border-primary/40 hover:bg-primary/5"
        >
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <FileUp className="size-5" />
          </div>
          <p className="text-sm font-semibold">Tap to choose a PDF</p>
          <p className="mt-1 text-xs text-muted-foreground">
            or drag and drop a file here
          </p>
        </button>

        {file && (
          <div className="mt-3 rounded-xl border border-border bg-card px-3.5 py-3">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{file}</p>
                <p className="text-[11px] text-muted-foreground">
                  PDF • 2.4 MB • 4 pages
                </p>
              </div>
              <button
                onClick={() => setFile(null)}
                className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
              >
                Remove
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="px-5 pt-5">
        <p className="mb-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
          Other ways
        </p>
        <div className="grid grid-cols-2 gap-2">
          <SourceTile icon={Camera} label="Scan from photo" sub="OCR" />
          <SourceTile icon={Globe} label="Paste a URL" sub="Coming soon" />
        </div>
      </div>

      <div className="px-5 pt-6">
        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
          <div className="flex items-start gap-2.5">
            <Sparkles className="mt-0.5 size-4 shrink-0 text-primary" />
            <p className="text-xs leading-relaxed text-foreground/80">
              <span className="font-medium">How parsing works.</span>{" "}
              Modern row-numbered PDFs parse instantly without AI. For older or
              prose-style patterns Stitchly will use AI — you&apos;ll see a
              confidence indicator on every row.
            </p>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 mt-auto bg-gradient-to-t from-background via-background to-transparent px-5 pt-6 pb-4">
        <Button
          size="lg"
          className="w-full"
          disabled={!file}
          onClick={() => router.push("/library/upload/processing")}
        >
          {file ? "Parse pattern" : "Choose a file to continue"}
        </Button>
      </div>
    </div>
  );
}

function SourceTile({
  icon: Icon,
  label,
  sub,
}: {
  icon: typeof Camera;
  label: string;
  sub: string;
}) {
  return (
    <Link
      href="#"
      className="flex flex-col items-start gap-2 rounded-xl border border-border bg-card p-3"
    >
      <div className="flex size-9 items-center justify-center rounded-lg bg-accent text-foreground">
        <Icon className="size-4" />
      </div>
      <div>
        <p className="text-xs font-semibold">{label}</p>
        <p className="text-[10px] text-muted-foreground">{sub}</p>
      </div>
    </Link>
  );
}
