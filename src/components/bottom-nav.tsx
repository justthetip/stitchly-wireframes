"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Layers, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { href: "/", label: "Home", icon: Home, match: (p: string) => p === "/" },
  {
    href: "/library",
    label: "Library",
    icon: BookOpen,
    match: (p: string) => p.startsWith("/library"),
  },
  {
    href: "/projects",
    label: "Projects",
    icon: Layers,
    match: (p: string) => p.startsWith("/projects"),
  },
];

export function BottomNav() {
  const pathname = usePathname();
  // Hide nav on the immersive reader screen
  const isReader = /^\/projects\/[^/]+\/reader/.test(pathname);
  if (isReader) return null;

  return (
    <nav className="absolute inset-x-0 bottom-0 border-t border-border bg-background/95 backdrop-blur">
      <div className="relative grid grid-cols-3">
        {tabs.map((tab) => {
          const active = tab.match(pathname);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-1 py-3 text-[10px] font-medium tracking-wide uppercase",
                active ? "text-primary" : "text-muted-foreground"
              )}
            >
              <Icon className="size-5" strokeWidth={active ? 2.2 : 1.8} />
              {tab.label}
            </Link>
          );
        })}
        <Link
          href="/library/upload"
          aria-label="Add pattern"
          className="absolute -top-6 left-1/2 -translate-x-1/2 flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 ring-4 ring-background"
        >
          <Plus className="size-5" strokeWidth={2.5} />
        </Link>
      </div>
    </nav>
  );
}
