import { cn } from "@/lib/utils";

type Art = "basket" | "yarn" | "scarf" | "square";

const positions: Record<Art, string> = {
  basket: "0% 0%",
  yarn: "100% 0%",
  scarf: "0% 100%",
  square: "100% 100%",
};

export function CraftArt({ art, className }: { art: Art; className?: string }) {
  return (
    <span
      role="img"
      aria-label={`${art} illustration`}
      className={cn("block bg-[url('/illustrations/stitchly-sheet.png')] bg-[length:200%_200%] bg-no-repeat", className)}
      style={{ backgroundPosition: positions[art] }}
    />
  );
}

export function PatternArt({ index = 0, className }: { index?: number; className?: string }) {
  const art: Art[] = ["scarf", "yarn", "basket", "square"];
  return <CraftArt art={art[index % art.length]} className={className} />;
}
