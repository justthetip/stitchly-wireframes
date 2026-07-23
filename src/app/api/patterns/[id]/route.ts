import { del } from "@vercel/blob";
import { db, type DbPattern, type DbPatternRow } from "@/lib/db";
import { apiError, requireUser } from "@/lib/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await params; const sql = db();
    const patterns = await sql`select id, owner_id, name, designer, craft, difficulty, yarn, tool, total_rows, source, blob_url, page_count, created_at, updated_at from public.patterns where id = ${id} and owner_id = ${user.id}` as DbPattern[];
    if (!patterns[0]) return Response.json({ error: "Pattern not found" }, { status: 404 });
    const rows = await sql`select id, pattern_id, row_number, section, instructions, stitch_count, confidence from public.pattern_rows where pattern_id = ${id} order by row_number` as DbPatternRow[];
    return Response.json({ pattern: patterns[0], rows });
  } catch (error) { return apiError(error); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await params; const body = await request.json() as { name?: string; designer?: string; yarn?: string; tool?: string; rows?: Array<{ id?: string; rowNumber: number; section?: string | null; instructions: string; stitchCount?: number | null; confidence?: string }> }; const sql = db();
    const owned = await sql`select id from public.patterns where id = ${id} and owner_id = ${user.id}`;
    if (!owned[0]) return Response.json({ error: "Pattern not found" }, { status: 404 });
    await sql`update public.patterns set name = coalesce(${body.name ?? null}, name), designer = coalesce(${body.designer ?? null}, designer), yarn = coalesce(${body.yarn ?? null}, yarn), tool = coalesce(${body.tool ?? null}, tool), updated_at = now() where id = ${id} and owner_id = ${user.id}`;
    if (body.rows) {
      const rows = body.rows.filter(row => Number.isInteger(row.rowNumber) && row.rowNumber > 0 && row.instructions.trim());
      if (!rows.length) return Response.json({ error: "At least one valid instruction is required" }, { status: 400 });
      const rowPayload = JSON.stringify(rows.map(row => ({
        row_number: row.rowNumber,
        section: row.section ?? null,
        instructions: row.instructions.trim(),
        stitch_count: row.stitchCount ?? null,
        confidence: ["high", "medium", "low"].includes(row.confidence ?? "") ? row.confidence : "medium",
      })));
      await sql.transaction([
        sql`delete from public.pattern_rows where pattern_id = ${id}`,
        sql`insert into public.pattern_rows (pattern_id, row_number, section, instructions, stitch_count, confidence)
          select ${id}, row_number, section, instructions, stitch_count, confidence
          from jsonb_to_recordset(${rowPayload}::jsonb)
          as row_data(row_number integer, section text, instructions text, stitch_count integer, confidence text)`,
        sql`update public.patterns set total_rows = ${rows.length}, updated_at = now() where id = ${id} and owner_id = ${user.id}`,
      ]);
    }
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await params; const sql = db();
    const deleted = await sql`delete from public.patterns where id = ${id} and owner_id = ${user.id} returning id, blob_url` as Array<{ id: string; blob_url: string | null }>;
    if (!deleted[0]) return Response.json({ error: "Pattern not found" }, { status: 404 });
    if (deleted[0].blob_url) await del(deleted[0].blob_url);
    return new Response(null, { status: 204 });
  } catch (error) { return apiError(error); }
}
