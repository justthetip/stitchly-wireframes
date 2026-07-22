import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";

export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;
  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => ({
        allowedContentTypes: ["application/pdf"],
        maximumSizeInBytes: 25 * 1024 * 1024,
        addRandomSuffix: true,
        tokenPayload: JSON.stringify({ originalPathname: pathname }),
      }),
      onUploadCompleted: async () => {
        // Parsing is deliberately queued for the next backend milestone.
        // The private Blob URL is returned to the client and never exposed publicly.
      },
    });
    return Response.json(jsonResponse);
  } catch (error) {
    return Response.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
  }
}
