import { get } from "@vercel/blob";
import { extractText, getDocumentProxy } from "unpdf";
import { db, type DbPattern, type DbPatternRow } from "@/lib/db";
import { parsePatternText } from "@/lib/pattern-parser";
import { apiError, requireUser } from "@/lib/session";

export const maxDuration = 60;

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = await request.json() as { url?: string; name?: string };
    if (!body.url || !body.name) return Response.json({ error: "A private PDF URL and filename are required" }, { status: 400 });
    if (!body.url.includes(".private.blob.vercel-storage.com/")) return Response.json({ error: "Only Stitchly private Blob files can be parsed" }, { status: 400 });
    if (!new URL(body.url).pathname.startsWith(`/patterns/${user.id}/`)) return Response.json({ error: "This upload does not belong to the signed-in user" }, { status: 403 });

    const result = await get(body.url, { access: "private" });
    if (!result?.stream || result.statusCode !== 200) return Response.json({ error: "The uploaded PDF could not be retrieved" }, { status: 404 });
    if (result.blob.contentType !== "application/pdf") return Response.json({ error: "The uploaded file is not a PDF" }, { status: 415 });
    if ((result.blob.size ?? 0) > 25 * 1024 * 1024) return Response.json({ error: "PDF exceeds the 25 MB limit" }, { status: 413 });

    const buffer = new Uint8Array(await new Response(result.stream).arrayBuffer());
    const pdf = await getDocumentProxy(buffer);
    const extracted = await extractText(pdf, { mergePages: true });
    const parsed = parsePatternText(extracted.text, body.name);
    const sql = db();
    const inserted = await sql`insert into public.patterns (owner_id, name, craft, total_rows, source, blob_url, page_count, raw_text) values (${user.id}, ${parsed.name}, ${parsed.craft}, ${parsed.totalRows}, 'PDF', ${body.url}, ${extracted.totalPages}, ${extracted.text}) returning id, owner_id, name, designer, craft, difficulty, yarn, tool, total_rows, source, blob_url, page_count, created_at, updated_at` as DbPattern[];
    const pattern = inserted[0];
    try {
      const rowPayload = JSON.stringify(parsed.rows.map(row => ({
        row_number: row.rowNumber,
        section: row.section,
        instructions: row.instructions,
        stitch_count: row.stitchCount,
        confidence: row.confidence,
      })));
      await sql`insert into public.pattern_rows (pattern_id, row_number, section, instructions, stitch_count, confidence)
        select ${pattern.id}, row_number, section, instructions, stitch_count, confidence
        from jsonb_to_recordset(${rowPayload}::jsonb)
        as row_data(row_number integer, section text, instructions text, stitch_count integer, confidence text)`;
    } catch (error) {
      await sql`delete from public.patterns where id = ${pattern.id} and owner_id = ${user.id}`;
      throw error;
    }
    const rows = await sql`select id, pattern_id, row_number, section, instructions, stitch_count, confidence from public.pattern_rows where pattern_id = ${pattern.id} order by row_number` as DbPatternRow[];
    return Response.json({ pattern, rows }, { status: 201 });
  } catch (error) { return apiError(error); }
}
