import { db, type DbPatternRow, type DbProject } from "@/lib/db";
import { apiError, requireUser } from "@/lib/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await params; const sql = db();
    const projects = await sql`select p.id, p.owner_id, p.pattern_id, p.name, p.status, p.yarn, p.current_row, p.started_at, p.last_worked_at, p.completed_at, pt.name as pattern_name, pt.total_rows, pt.craft from public.projects p join public.patterns pt on pt.id = p.pattern_id where p.id = ${id} and p.owner_id = ${user.id}` as DbProject[];
    if (!projects[0]) return Response.json({ error: "Project not found" }, { status: 404 });
    const rows = await sql`select r.id, r.pattern_id, r.row_number, r.section, r.instructions, r.stitch_count, r.confidence from public.pattern_rows r where r.pattern_id = ${projects[0].pattern_id} order by r.row_number` as DbPatternRow[];
    const notes = await sql`select id, row_number, body, created_at, updated_at from public.project_notes where project_id = ${id} and owner_id = ${user.id} order by created_at desc`;
    return Response.json({ project: projects[0], rows, notes });
  } catch (error) { return apiError(error); }
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await params; const body = await request.json() as { currentRow?: number; status?: "active" | "completed"; name?: string }; const sql = db();
    const rows = await sql`update public.projects set current_row = coalesce(${body.currentRow ?? null}, current_row), status = coalesce(${body.status ?? null}, status), name = coalesce(${body.name ?? null}, name), last_worked_at = now(), completed_at = case when ${body.status ?? null} = 'completed' then now() else completed_at end where id = ${id} and owner_id = ${user.id} returning id`;
    if (!rows[0]) return Response.json({ error: "Project not found" }, { status: 404 });
    return Response.json({ ok: true });
  } catch (error) { return apiError(error); }
}
