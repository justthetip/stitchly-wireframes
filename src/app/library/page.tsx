"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Plus, Search, FileUp } from "lucide-react";
import { ScreenHeader } from "@/components/screen-header";
import { PatternArt } from "@/components/craft-art";
import { patterns } from "@/lib/mock-data";
import { cn } from "@/lib/utils";

type SavedUpload = { name: string; savedAt: string };

export default function LibraryPage() {
  const [query, setQuery] = useState("");
  const [craft, setCraft] = useState("All");
  const [savedUpload, setSavedUpload] = useState<SavedUpload | null>(null);
  useEffect(() => { const timer = window.setTimeout(() => { const value = localStorage.getItem("stitchly:saved-pattern"); if (value) { try { setSavedUpload(JSON.parse(value)); } catch {} } }, 0); return () => window.clearTimeout(timer); }, []);
  const filtered = useMemo(() => patterns.filter((p) => (craft === "All" || p.craft === craft.toLowerCase()) && `${p.name} ${p.designer}`.toLowerCase().includes(query.toLowerCase())), [query, craft]);
  return <div className="pb-8">
    <ScreenHeader title="Your pattern library" right={<Link href="/library/upload" className="flex size-10 items-center justify-center rounded-2xl bg-primary text-white shadow-md shadow-primary/20"><Plus className="size-5" /></Link>} />
    <div className="px-5 pt-5 md:px-8">
      {savedUpload ? <Link href="/library/amigurumi-bunny" className="stitch-card mb-6 flex items-center gap-4 p-4"><span className="flex size-14 items-center justify-center rounded-2xl bg-secondary font-heading text-xs font-black">PDF</span><div className="min-w-0 flex-1"><p className="font-heading truncate font-extrabold">{savedUpload.name.replace(/\.pdf$/i, "")}</p><p className="text-xs text-muted-foreground">Saved to your library</p></div></Link> : <div className="mb-7 rounded-3xl bg-[#dff4fb] p-5 md:flex md:items-center md:justify-between"><div><p className="text-xs font-extrabold uppercase tracking-[.15em] text-primary">Your library is empty</p><h2 className="font-heading mt-1 text-2xl font-black">Bring your patterns together</h2><p className="mt-1 text-sm text-muted-foreground">Uploaded PDFs will appear here.</p></div><Link href="/library/upload" className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-[#17324d] px-4 py-3 text-sm font-extrabold text-white md:mt-0"><FileUp className="size-4"/>Upload a PDF</Link></div>}
      <div className="mb-3"><p className="text-xs font-extrabold uppercase tracking-[.15em] text-primary">Examples to explore</p><p className="text-sm text-muted-foreground">Preview how different crafts look in Stitchly. These aren’t in your library.</p></div>
      <div className="flex items-center gap-3 rounded-2xl border bg-white px-4 py-3 shadow-sm"><Search className="size-4 text-muted-foreground"/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Pattern, designer or craft…" className="w-full bg-transparent text-sm outline-none" /></div>
      <div className="mt-4 flex gap-2">{["All","Knit","Crochet"].map(tag=><button key={tag} onClick={()=>setCraft(tag)} className={cn("rounded-full px-4 py-2 text-xs font-extrabold", craft===tag?"bg-[#17324d] text-white":"border bg-card text-muted-foreground")}>{tag}</button>)}</div>
      <div className="mt-6 grid grid-cols-2 gap-4 md:grid-cols-3">{filtered.map((pat,index)=><Link key={pat.id} href={`/library/${pat.id}`} className="stitch-card overflow-hidden p-2.5 transition hover:-translate-y-1">
        <div className={cn("relative aspect-square overflow-hidden rounded-2xl", ["bg-[#dff4fb]","bg-[#ffe6a8]","bg-[#ffd9df]","bg-[#e3f0d1]"][index%4])}><PatternArt index={index} className="absolute inset-[8%] size-[84%]" /></div>
        <div className="px-1 pb-1 pt-3"><p className="font-heading line-clamp-2 text-sm font-extrabold leading-tight">{pat.name}</p><p className="mt-1 truncate text-[11px] text-muted-foreground">{pat.designer}</p><p className="mt-2 text-[10px] font-bold uppercase tracking-wide text-primary">{pat.craft} · {pat.totalRows} rows</p></div>
      </Link>)}</div>
      {filtered.length===0 && <div className="py-20 text-center"><PatternArt index={1} className="mx-auto size-28"/><h2 className="font-heading mt-4 text-xl font-extrabold">No tangled results</h2><p className="text-sm text-muted-foreground">Try another search.</p></div>}
    </div>
  </div>
}
