export type ExtractedRow = {
  rowNumber: number;
  section: string | null;
  instructions: string;
  stitchCount: number | null;
  confidence: "high" | "medium" | "low";
};

export type ParsedPattern = {
  name: string;
  craft: "knit" | "crochet";
  totalRows: number;
  rows: ExtractedRow[];
};

const rowStart = /^(?:row|round|rnd|r)\s*([0-9]+)(?:\s*[-–—:.])?\s*(.*)$/i;
const numberedStart = /^([0-9]{1,4})[.)]\s+(.+)$/;
const stitchCount = /(?:\[|\(|—|-)?\s*([0-9]+)\s*(?:sts?|stitches)\b[\s\].),;:—-]*$/i;

function clean(value: string) {
  return value.replace(/\s+/g, " ").replace(/^[-•*]\s*/, "").trim();
}

function titleFromFilename(filename: string) {
  return filename.replace(/\.pdf$/i, "").replace(/[-_]+/g, " ").replace(/\s+/g, " ").trim().replace(/\b\w/g, c => c.toUpperCase());
}

function inferCraft(text: string): "knit" | "crochet" {
  const crochet = (text.match(/\b(sc|dc|hdc|tr|ch|sl st|crochet|hook)\b/gi) ?? []).length;
  const knit = (text.match(/\b(knit|purl|k\d|p\d|ssk|k2tog|needle|cast on)\b/gi) ?? []).length;
  return crochet > knit ? "crochet" : "knit";
}

export function parsePatternText(text: string, filename: string): ParsedPattern {
  const normalized = text
    .replace(/\r/g, "\n")
    .replace(/\u00ad/g, "")
    // PDF text layers often flatten visual lines into one long string.
    .replace(/(?=\b(?:row|round|rnd|r)\s*[0-9]+\s*[-–—:.])/gi, "\n");
  const lines = normalized.split(/\n+/).map(clean).filter(Boolean);
  const rows: ExtractedRow[] = [];
  let current: { number: number; parts: string[]; section: string | null; explicit: boolean } | null = null;
  let section: string | null = null;

  const flush = () => {
    if (!current) return;
    const instructions = clean(current.parts.join(" "));
    if (instructions.length >= 2) {
      const count = instructions.match(stitchCount);
      rows.push({
        rowNumber: current.number,
        section: current.section,
        instructions,
        stitchCount: count ? Number(count[1]) : null,
        confidence: current.explicit && instructions.length > 5 ? "high" : instructions.length > 12 ? "medium" : "low",
      });
    }
    current = null;
  };

  for (const line of lines) {
    const explicit = line.match(rowStart);
    const numbered = line.match(numberedStart);
    if (explicit || numbered) {
      flush();
      const match = explicit ?? numbered!;
      current = { number: Number(match[1]), parts: [match[2]], section, explicit: Boolean(explicit) };
      continue;
    }
    const looksLikeHeading = line.length < 55 && !/[.!?]$/.test(line) && (/^[A-Z\s&–—-]+$/.test(line) || /^(body|sleeve|yoke|border|setup|set-up|finishing|repeat|materials|instructions)/i.test(line));
    if (looksLikeHeading && !current) {
      section = line.replace(/:$/, "");
      continue;
    }
    if (current) current.parts.push(line);
  }
  flush();

  if (rows.length < 2) {
    const candidates = normalized.split(/\n{2,}|(?<=[.!?])\s+(?=[A-Z])/).map(clean).filter(value => value.length >= 12 && value.length <= 700);
    rows.splice(0, rows.length, ...candidates.slice(0, 500).map((instructions, index) => {
      const count = instructions.match(stitchCount);
      return { rowNumber: index + 1, section: null, instructions, stitchCount: count ? Number(count[1]) : null, confidence: "low" as const };
    }));
  }

  const deduped = rows.filter((row, index) => index === 0 || row.rowNumber !== rows[index - 1].rowNumber || row.instructions !== rows[index - 1].instructions);
  if (!deduped.length) throw new Error("No readable instructions were found in this PDF. It may be image-only or scanned.");
  return { name: titleFromFilename(filename), craft: inferCraft(normalized), totalRows: deduped.length, rows: deduped };
}
