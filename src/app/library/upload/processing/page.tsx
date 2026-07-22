"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, LoaderCircle } from "lucide-react";
import { CraftArt } from "@/components/craft-art";

const steps = ["Opening your PDF", "Finding sizes and materials", "Separating the instructions", "Checking every row"];

export default function ProcessingPage(){
  const router=useRouter(); const [step,setStep]=useState(0); const [name,setName]=useState("Your pattern");
  useEffect(()=>{const upload=sessionStorage.getItem("stitchly:last-upload");const nameTimer=window.setTimeout(()=>{if(upload){try{setName(JSON.parse(upload).name)}catch{}}},0);const timer=window.setInterval(()=>setStep(current=>{if(current>=steps.length-1){window.clearInterval(timer);window.setTimeout(()=>router.push("/library/upload/review"),700);return current}return current+1}),850);return()=>{window.clearTimeout(nameTimer);window.clearInterval(timer)}},[router]);
  return <div className="flex min-h-[calc(100dvh-6rem)] items-center justify-center px-5 py-10"><div className="w-full max-w-lg text-center">
    <div className="relative mx-auto size-52"><span className="absolute inset-6 animate-ping rounded-full bg-[#59c3eb]/15"/><CraftArt art="basket" className="relative size-52 animate-[pulse_2s_ease-in-out_infinite]"/></div>
    <p className="mt-2 text-xs font-extrabold uppercase tracking-[.18em] text-primary">Untangling</p><h1 className="font-heading mt-1 text-3xl font-black">Making this easier to follow</h1><p className="mx-auto mt-2 max-w-sm truncate text-sm text-muted-foreground">{name}</p>
    <div className="stitch-card mx-auto mt-8 max-w-sm space-y-1 p-3 text-left">{steps.map((label,index)=><div key={label} className="flex items-center gap-3 rounded-2xl px-3 py-2.5"><span className={`flex size-7 items-center justify-center rounded-full ${index<step?"bg-[#dcedc8] text-[#2e6b46]":index===step?"bg-secondary text-[#17324d]":"bg-muted text-muted-foreground"}`}>{index<step?<Check className="size-4" strokeWidth={3}/>:index===step?<LoaderCircle className="size-4 animate-spin"/>:<span className="text-xs font-black">{index+1}</span>}</span><span className={`text-sm font-bold ${index<=step?"text-foreground":"text-muted-foreground"}`}>{label}</span></div>)}</div>
    <p className="mt-5 text-xs text-muted-foreground">Keep this page open while we prepare the review.</p>
  </div></div>
}
