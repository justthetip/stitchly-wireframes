export type Pattern = {
  id: string;
  name: string;
  designer: string;
  craft: "knit" | "crochet";
  cover: string; // emoji stand-in
  totalRows: number;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  yarn: string;
  hook?: string;
  needle?: string;
  source: "PDF" | "Manual" | "Web";
  importedAt: string;
};

export type Row = {
  n: number;
  section?: string;
  instructions: string;
  stitchCount?: number;
  noteText?: string;
};

export type Project = {
  id: string;
  patternId: string;
  name: string;
  status: "active" | "completed";
  currentRow: number;
  startedAt: string;
  lastWorkedAt: string;
  notes: string[];
};

export const patterns: Pattern[] = [
  {
    id: "aran-scarf",
    name: "Aran Cable Scarf",
    designer: "Eleanor Knits",
    craft: "knit",
    cover: "🧣",
    totalRows: 80,
    difficulty: "Intermediate",
    yarn: "Aran weight wool, 400m",
    needle: "5mm",
    source: "PDF",
    importedAt: "2026-06-12",
  },
  {
    id: "amigurumi-bunny",
    name: "Pocket Bunny Amigurumi",
    designer: "Hooked by Mia",
    craft: "crochet",
    cover: "🐰",
    totalRows: 36,
    difficulty: "Beginner",
    yarn: "DK cotton, 80m",
    hook: "3.5mm",
    source: "PDF",
    importedAt: "2026-06-18",
  },
  {
    id: "ribbed-beanie",
    name: "Ribbed Slouchy Beanie",
    designer: "WoolHaus",
    craft: "knit",
    cover: "🧶",
    totalRows: 64,
    difficulty: "Beginner",
    yarn: "Worsted, 180m",
    needle: "4.5mm",
    source: "PDF",
    importedAt: "2026-06-09",
  },
  {
    id: "granny-square",
    name: "Sunburst Granny Square",
    designer: "Hookerly",
    craft: "crochet",
    cover: "🌻",
    totalRows: 8,
    difficulty: "Beginner",
    yarn: "DK acrylic, 50m / square",
    hook: "4mm",
    source: "Web",
    importedAt: "2026-05-30",
  },
  {
    id: "fair-isle-mittens",
    name: "Fair Isle Mittens",
    designer: "Highland Loom",
    craft: "knit",
    cover: "🧤",
    totalRows: 120,
    difficulty: "Advanced",
    yarn: "4-ply, 2 colours × 120m",
    needle: "3.25mm",
    source: "PDF",
    importedAt: "2026-05-22",
  },
];

export const projects: Project[] = [
  {
    id: "aran-scarf-mum",
    patternId: "aran-scarf",
    name: "Aran scarf — for Mum",
    status: "active",
    currentRow: 24,
    startedAt: "2026-06-13",
    lastWorkedAt: "2026-06-21",
    notes: ["Mum likes the wider cable — swap C4F for C6F from row 30"],
  },
  {
    id: "bunny-elsie",
    patternId: "amigurumi-bunny",
    name: "Bunny for Elsie",
    status: "active",
    currentRow: 5,
    startedAt: "2026-06-19",
    lastWorkedAt: "2026-06-20",
    notes: [],
  },
  {
    id: "beanie-test",
    patternId: "ribbed-beanie",
    name: "Beanie (gift stash)",
    status: "completed",
    currentRow: 64,
    startedAt: "2026-05-01",
    lastWorkedAt: "2026-05-19",
    notes: ["Worked one extra inch before crown shaping"],
  },
];

// Parsed rows for the Aran scarf — used by reader + parse-review screens
export const aranScarfRows: Row[] = [
  { n: 1, section: "Set-up", instructions: "Cast on 48 sts.", stitchCount: 48 },
  { n: 2, section: "Set-up", instructions: "K all sts.", stitchCount: 48 },
  { n: 3, section: "Set-up", instructions: "P all sts.", stitchCount: 48 },
  {
    n: 4,
    section: "Body — cable repeat",
    instructions: "K4, *P2, C4F, P2, K4*; rep * to end.",
    stitchCount: 48,
  },
  {
    n: 5,
    section: "Body — cable repeat",
    instructions: "P4, *K2, P4, K2, P4*; rep * to end.",
    stitchCount: 48,
  },
  {
    n: 6,
    section: "Body — cable repeat",
    instructions: "K4, *P2, K4, P2, K4*; rep * to end.",
    stitchCount: 48,
  },
  {
    n: 7,
    section: "Body — cable repeat",
    instructions: "P4, *K2, P4, K2, P4*; rep * to end.",
    stitchCount: 48,
  },
  {
    n: 8,
    section: "Body — cable repeat",
    instructions: "K4, *P2, C4B, P2, K4*; rep * to end.",
    stitchCount: 48,
  },
];

// Sample of an AI-parsed pattern shown on the parse-review screen.
// Each row has a confidence so we can demo the uncertainty UX.
export type ParsedRow = Row & { confidence: "high" | "medium" | "low" };

export const sampleParsed: ParsedRow[] = [
  {
    n: 1,
    section: "Set-up",
    instructions: "Magic ring, 6 sc.",
    stitchCount: 6,
    confidence: "high",
  },
  {
    n: 2,
    section: "Set-up",
    instructions: "Inc in each st around.",
    stitchCount: 12,
    confidence: "high",
  },
  {
    n: 3,
    instructions: "*Sc, inc*; rep around.",
    stitchCount: 18,
    confidence: "high",
  },
  {
    n: 4,
    instructions: "*Sc 2, inc*; rep around.",
    stitchCount: 24,
    confidence: "high",
  },
  {
    n: 5,
    instructions: "*Sc 3, inc*; rep around.",
    stitchCount: 30,
    confidence: "medium",
  },
  {
    n: 6,
    instructions: "Sc around.",
    stitchCount: 30,
    confidence: "high",
  },
  {
    n: 7,
    instructions: "*Sc 4, inc*; rep around.",
    stitchCount: 36,
    confidence: "high",
  },
  {
    n: 8,
    section: "Body",
    instructions:
      "Sc around — see designer note about colour change on row 8 (couldn't read clearly).",
    stitchCount: 36,
    confidence: "low",
  },
  {
    n: 9,
    instructions: "Sc around.",
    stitchCount: 36,
    confidence: "high",
  },
  {
    n: 10,
    instructions: "*Sc 5, inc*; rep around.",
    stitchCount: 42,
    confidence: "high",
  },
];

export function getPattern(id: string) {
  return patterns.find((p) => p.id === id);
}
export function getProject(id: string) {
  return projects.find((p) => p.id === id);
}
