import { neon } from "@neondatabase/serverless";

export function db() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not configured");
  return neon(url);
}

export type DbPattern = {
  id: string;
  owner_id: string;
  name: string;
  designer: string | null;
  craft: "knit" | "crochet";
  difficulty: string | null;
  yarn: string | null;
  tool: string | null;
  total_rows: number;
  source: string;
  blob_url: string | null;
  page_count: number | null;
  created_at: string;
  updated_at: string;
};

export type DbPatternRow = {
  id: string;
  pattern_id: string;
  row_number: number;
  section: string | null;
  instructions: string;
  stitch_count: number | null;
  confidence: "high" | "medium" | "low" | null;
};

export type DbProject = {
  id: string;
  owner_id: string;
  pattern_id: string;
  name: string;
  status: "planned" | "active" | "completed";
  yarn: string | null;
  current_row: number;
  started_at: string;
  last_worked_at: string;
  completed_at: string | null;
  pattern_name?: string;
  total_rows?: number;
  craft?: "knit" | "crochet";
};
