import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { apiError, requireUser } from "@/lib/session";

export async function POST(request: Request) {
  try {
    const user = await requireUser();
    const body = (await request.json()) as HandleUploadBody;
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!pathname.startsWith(`patterns/${user.id}/`)) throw new Error("Invalid upload path");
        return { allowedContentTypes: ["application/pdf"], maximumSizeInBytes: 25 * 1024 * 1024, addRandomSuffix: true, tokenPayload: JSON.stringify({ ownerId: user.id, originalPathname: pathname }) };
      },
      onUploadCompleted: async () => {
        // Parsing is deliberately queued for the next backend milestone.
        // The private Blob URL is returned to the client and never exposed publicly.
      },
    });
    return Response.json(jsonResponse);
  } catch (error) { return apiError(error); }
}
