"use client";

import Link from "next/link";
import { LogOut, ShieldCheck, Cloud, ChevronRight } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { CraftArt } from "@/components/craft-art";
import { ScreenHeader } from "@/components/screen-header";

export default function AccountPage() {
  const session = authClient.useSession();
  const user = session.data?.user;
  return <div className="pb-8"><ScreenHeader title="Your Stitchly" />
    <div className="px-5 pt-6 md:px-8">
      <div className="stitch-card relative overflow-hidden bg-[#f5a623] p-6"><div className="stitch-pattern absolute inset-0 opacity-30"/><CraftArt art="yarn" className="absolute -bottom-8 -right-2 size-36"/><div className="relative max-w-[70%]"><div className="flex size-12 items-center justify-center rounded-2xl bg-white font-heading text-xl font-black">{user?.name?.[0] ?? "M"}</div><h1 className="font-heading mt-3 text-2xl font-black">{user?.name ?? "Your craft corner"}</h1><p className="mt-1 text-sm text-[#17324d]/70">{user?.email ?? "Sign in to sync your progress everywhere."}</p></div></div>
      {!user ? <Link href="/sign-in" className="mt-5 flex w-full items-center justify-center rounded-2xl bg-primary px-5 py-3.5 font-heading font-extrabold text-white">Sign in or create account</Link> : <button onClick={()=>authClient.signOut()} className="mt-5 flex items-center gap-2 text-sm font-bold text-primary"><LogOut className="size-4"/>Sign out</button>}
      <div className="mt-7 space-y-2"><Setting icon={Cloud} label="Cloud sync" detail={user?"On":"Sign in to enable"}/><Setting icon={ShieldCheck} label="Private patterns" detail="Protected by Vercel Blob"/></div>
    </div>
  </div>
}
function Setting({icon:Icon,label,detail}:{icon:typeof Cloud;label:string;detail:string}){return <div className="stitch-card flex items-center gap-3 p-4"><span className="flex size-10 items-center justify-center rounded-xl bg-accent"><Icon className="size-5"/></span><div className="flex-1"><p className="font-heading text-sm font-extrabold">{label}</p><p className="text-xs text-muted-foreground">{detail}</p></div><ChevronRight className="size-4 text-muted-foreground"/></div>}
