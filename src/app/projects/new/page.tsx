"use client";

import Link from "next/link";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ScreenHeader } from "@/components/screen-header";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { patterns, getPattern } from "@/lib/mock-data";
import { saveDraftProject } from "@/lib/persistence";
import { PatternArt } from "@/components/craft-art";

export default function NewProjectPage() {
  return (
    <Suspense>
      <NewProjectInner />
    </Suspense>
  );
}

function NewProjectInner() {
  const router = useRouter();
  const search = useSearchParams();
  const patternId = search.get("pattern") ?? patterns[0].id;
  const pat = getPattern(patternId) ?? patterns[0];

  const [name, setName] = useState(`${pat.name} — WIP`);
  const [yarn, setYarn] = useState("");
  const [notes, setNotes] = useState("");

  return (
    <div className="flex flex-col pb-32">
      <ScreenHeader back={`/library/${pat.id}`} title="New project" />

      <div className="px-5 pt-5">
        <div className="flex items-center gap-3 rounded-xl border border-border bg-card p-3">
          <div className="relative size-12 overflow-hidden rounded-xl bg-accent">
            <PatternArt index={pat.id === "aran-scarf" ? 0 : 1} className="absolute inset-0 size-12" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{pat.name}</p>
            <p className="text-[11px] text-muted-foreground">
              by {pat.designer} • {pat.totalRows} rows
            </p>
          </div>
          <Link
            href="/library"
            className="text-xs font-medium text-primary"
          >
            Change
          </Link>
        </div>
      </div>

      <div className="space-y-4 px-5 pt-5">
        <div>
          <Label htmlFor="name">Project name</Label>
          <Input
            id="name"
            className="mt-1.5"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <p className="mt-1 text-[10px] text-muted-foreground">
            Give it a name so you can tell projects apart (e.g. &quot;for Mum&quot;).
          </p>
        </div>

        <div>
          <Label htmlFor="yarn">Yarn you&apos;re using</Label>
          <Input
            id="yarn"
            className="mt-1.5"
            placeholder="e.g. Drops Karisma — Mustard"
            value={yarn}
            onChange={(e) => setYarn(e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="notes">Notes (optional)</Label>
          <Textarea
            id="notes"
            className="mt-1.5"
            placeholder="Modifications, size adjustments, anything to remember…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
      </div>

      <div className="absolute bottom-16 left-0 right-0 border-t border-border bg-background/95 px-5 py-3 backdrop-blur">
        <Button
          size="lg"
          className="w-full"
          onClick={() => { saveDraftProject({ name, yarn, notes, patternId: pat.id }); router.push("/projects/aran-scarf-mum/reader"); }}
        >
          Create &amp; start crafting
        </Button>
      </div>
    </div>
  );
}
