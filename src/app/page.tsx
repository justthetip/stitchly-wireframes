"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, FileUp, Play, Sparkles } from "lucide-react";
import { CraftArt } from "@/components/craft-art";

type Draft = { name: string; yarn: string; notes: string; patternId: string };

export default function HomePage(){
  const [draft,setDraft]=useState<Draft|null>(null);
  useEffect(()=>{const timer=window.setTimeout(()=>{const value=localStorage.getItem("stitchly:last-project");if(value){try{setDraft(JSON.parse(value))}catch{}}},0);return()=>window.clearTimeout(timer)},[]);
  return <div className="pb-10">
    <header className="relative overflow-hidden bg-[#f5a623] px-5 pb-9 pt-8 md:px-10"><div className="stitch-pattern absolute inset-0 opacity-35"/><div className="relative flex items-start justify-between"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-[#17324d]/65">Your craft corner</p><h1 className="font-heading mt-1 text-3xl font-black">What shall we make?</h1></div><Link href="/account" className="flex size-11 items-center justify-center rounded-2xl bg-white font-heading font-black text-primary shadow-sm">You</Link></div></header>
    <div className="px-5 pt-7 md:px-10">
      {draft ? <section className="stitch-card grid overflow-hidden md:grid-cols-[.8fr_1.2fr]"><div className="relative min-h-48 overflow-hidden bg-[#59c3eb]"><CraftArt art="scarf" className="absolute inset-4 m-auto size-40"/></div><div className="flex flex-col justify-center p-6"><p className="text-xs font-extrabold uppercase tracking-[.15em] text-primary">Continue making</p><h2 className="font-heading mt-1 text-2xl font-black">{draft.name}</h2><p className="mt-1 text-sm text-muted-foreground">Your newest project is ready.</p><Link href="/projects/aran-scarf-mum/reader" className="mt-5 inline-flex items-center gap-2 font-heading text-sm font-extrabold text-primary">Open reader <ArrowRight className="size-4"/></Link></div></section> : <EmptyHome/>}
      <section className="mt-9"><p className="text-xs font-extrabold uppercase tracking-[.16em] text-primary">How Stitchly works</p><h2 className="font-heading mt-1 text-2xl font-black">From PDF to one clear row</h2><div className="mt-4 grid gap-3 md:grid-cols-3"><Step icon={FileUp} number="01" title="Add your pattern" body="Upload a private PDF from your phone or computer."/><Step icon={Sparkles} number="02" title="Check the rows" body="Review what we found and correct anything unclear."/><Step icon={Play} number="03" title="Start making" body="Move through one focused instruction at a time."/></div></section>
      <Link href="/projects/aran-scarf-mum/reader" className="mt-8 flex items-center justify-between rounded-3xl bg-[#17324d] p-5 text-white"><div><p className="text-xs font-bold uppercase tracking-wider text-[#59c3eb]">Optional preview</p><p className="font-heading mt-1 text-lg font-extrabold">Try the reader with an example</p><p className="mt-1 text-xs text-white/65">This won’t be added to your projects.</p></div><ArrowRight className="size-5"/></Link>
    </div>
  </div>
}
function EmptyHome(){return <section className="relative overflow-hidden rounded-3xl bg-[#f58ba2] p-6 pb-7 md:pr-72"><div className="absolute -right-7 -top-8 size-48 rounded-full bg-[#fff8ea]/70"/><CraftArt art="basket" className="relative mx-auto size-52 md:absolute md:-bottom-12 md:right-8"/><div className="relative"><p className="text-xs font-extrabold uppercase tracking-[.15em] text-[#17324d]/60">Nothing tangled yet</p><h2 className="font-heading mt-1 text-3xl font-black">Your first project starts with a pattern</h2><p className="mt-2 max-w-md text-sm text-[#17324d]/75">Bring along a PDF and we’ll turn it into a calm, trackable making experience.</p><Link href="/library/upload" className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-[#17324d] px-5 py-3 font-heading text-sm font-extrabold text-white"><BookOpen className="size-4"/>Add your first pattern</Link></div></section>}
function Step({icon:Icon,number,title,body}:{icon:typeof FileUp;number:string;title:string;body:string}){return <div className="stitch-card p-5"><div className="flex items-center justify-between"><span className="flex size-10 items-center justify-center rounded-2xl bg-secondary"><Icon className="size-5"/></span><span className="font-heading text-sm font-black text-primary/50">{number}</span></div><h3 className="font-heading mt-4 font-extrabold">{title}</h3><p className="mt-1 text-sm leading-relaxed text-muted-foreground">{body}</p></div>}
