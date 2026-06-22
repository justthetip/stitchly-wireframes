"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

const steps = [
  { label: "Reading PDF text", ms: 500 },
  { label: "Detecting pattern structure", ms: 900 },
  { label: "Extracting row instructions", ms: 1200 },
  { label: "Checking stitch counts", ms: 900 },
];

export default function ProcessingPage() {
  const router = useRouter();
  const [stepIndex, setStepIndex] = useState(0);

  useEffect(() => {
    let i = 0;
    let cancelled = false;
    const next = () => {
      if (cancelled) return;
      if (i >= steps.length) {
        router.push("/library/upload/review");
        return;
      }
      const s = steps[i];
      setStepIndex(i);
      setTimeout(() => {
        i += 1;
        next();
      }, s.ms);
    };
    next();
    return () => {
      cancelled = true;
    };
  }, [router]);

  return (
    <div className="flex h-full flex-col items-center justify-center px-8 text-center">
      <div className="relative mb-6 flex size-20 items-center justify-center">
        <div className="absolute inset-0 animate-pulse rounded-full bg-primary/15" />
        <div className="relative flex size-14 items-center justify-center rounded-full bg-primary/90 text-primary-foreground">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </div>
      <h1 className="text-lg font-semibold tracking-tight">
        Parsing your pattern
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Usually takes about 5 seconds
      </p>

      <div className="mt-8 w-full max-w-xs space-y-3 text-left">
        {steps.map((s, i) => {
          const done = i < stepIndex;
          const active = i === stepIndex;
          return (
            <div
              key={s.label}
              className="flex items-center gap-3 text-sm"
            >
              <div
                className={
                  done
                    ? "flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground"
                    : active
                      ? "flex size-5 items-center justify-center rounded-full bg-primary/20 text-primary"
                      : "size-5 rounded-full border border-border"
                }
              >
                {done && <Check className="size-3" strokeWidth={3} />}
                {active && (
                  <Loader2 className="size-3 animate-spin" strokeWidth={3} />
                )}
              </div>
              <span
                className={
                  done || active ? "text-foreground" : "text-muted-foreground"
                }
              >
                {s.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
