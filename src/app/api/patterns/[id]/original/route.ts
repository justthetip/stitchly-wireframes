import { get } from "@vercel/blob";
import { db } from "@/lib/db";
import { apiError, requireUser } from "@/lib/session";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const user = await requireUser(); const { id } = await params; const sql = db();
    const patterns = await sql`select blob_url from public.patterns where id = ${id} and owner_id = ${user.id}` as Array<{ blob_url: string | null }>;
    if (!patterns[0]?.blob_url) return new Response("Not found", { status: 404 });
    const result = await get(patterns[0].blob_url, { access: "private", ifNoneMatch: request.headers.get("if-none-match") ?? undefined });
    if (!result) return new Response("Not found", { status: 404 });
    if (result.statusCode === 304) return new Response(null, { status: 304, headers: { ETag: result.blob.etag } });
    return new Response(result.stream, { headers: { "Content-Type": result.blob.contentType ?? "application/pdf", "Content-Disposition": "inline", "Cache-Control": "private, max-age=300", ETag: result.blob.etag } });
  } catch (error) { return apiError(error); }
}
