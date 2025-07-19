import { handleUpload, type HandleUploadBody } from "@vercel/blob/client"
import { NextResponse } from "next/server"

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody

  try {
    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        // Generate a client token for the browser to upload the file
        // ⚠️ Authenticate and authorize users before generating the token.
        // Otherwise, you're allowing anonymous uploads.

        // You can add authentication logic here
        // const session = await getSession(request);
        // if (!session) {
        //   throw new Error('Unauthorized');
        // }

        return {
          allowedContentTypes: [
            // Images
            "image/jpeg",
            "image/png",
            "image/gif",
            "image/webp",
            "image/svg+xml",
            // Documents
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "application/vnd.ms-excel",
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-powerpoint",
            "application/vnd.openxmlformats-officedocument.presentationml.presentation",
            // Text files
            "text/plain",
            "text/csv",
            "application/json",
            // Archives
            "application/zip",
            "application/x-rar-compressed",
            "application/x-7z-compressed",
            // Audio
            "audio/mpeg",
            "audio/wav",
            "audio/ogg",
            // Video
            "video/mp4",
            "video/mpeg",
            "video/quicktime",
            "video/x-msvideo",
          ],
          maximumSizeInBytes: 5 * 1024 * 1024 * 1024 * 1024, // 5TB
          tokenPayload: JSON.stringify({
            uploadedAt: new Date().toISOString(),
            // You can add user information here
            // userId: session.user.id,
          }),
        }
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // Get notified of client upload completion
        // ⚠️ This will not work on `localhost` websites,
        // Use ngrok or similar to get the full upload flow

        // Parse tokenPayload safely
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let payload: any = {}
        try {
          if (tokenPayload) {
            payload = JSON.parse(tokenPayload)
          }
        } catch (e) {
          console.error("Failed to parse tokenPayload:", e)
        }

        // Since PutBlobResult does not have size or uploadedAt, get from payload if available
        const size = payload.size ?? undefined
        const uploadedAt = payload.uploadedAt ?? undefined

        console.log("Blob upload completed:", {
          url: blob.url,
          pathname: blob.pathname,
          size,
          uploadedAt,
        })

        try {
          // Run any logic after the file upload completed
          console.log("Token payload:", payload)

          // Example: Save file information to database
          // await db.files.create({
          //   data: {
          //     url: blob.url,
          //     pathname: blob.pathname,
          //     size,
          //     uploadedAt,
          //     userId: payload.userId,
          //   },
          // });
        } catch (error) {
          console.error("Error processing upload completion:", error)
          // Don't throw here as it would cause the upload to fail
        }
      },
    })

    return NextResponse.json(jsonResponse)
  } catch (error) {
    console.error("Upload error:", error)
    return NextResponse.json({ error: (error as Error).message }, { status: 400 })
  }
}
