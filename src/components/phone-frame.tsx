import { BottomNav } from "./bottom-nav";

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto min-h-dvh w-full max-w-6xl md:px-6 md:py-6">
      <div className="relative min-h-dvh overflow-hidden bg-background md:min-h-[calc(100dvh-3rem)] md:rounded-[2rem] md:border md:shadow-2xl md:shadow-[#17324d]/10">
        <main className="mx-auto min-h-dvh w-full max-w-4xl pb-24 md:min-h-[calc(100dvh-3rem)]">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
