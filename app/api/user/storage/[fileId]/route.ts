import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { UTApi } from "uploadthing/server";
import { UserFilesService } from "@/lib/services/userFilesService";

const utapi = new UTApi();

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fileId } = await params;

    // Verify file belongs to user before deletion
    const fileRecord = await UserFilesService.getFileByKey(fileId, userId);
    if (!fileRecord) {
      return NextResponse.json(
        { error: "File not found or access denied" },
        { status: 404 }
      );
    }

    try {
      // Delete file from UploadThing
      await utapi.deleteFiles([fileId]);
    } catch (uploadthingError) {
      console.warn("UploadThing deletion failed, continuing with database cleanup:", uploadthingError);
    }

    // Delete file metadata from database
    const deleted = await UserFilesService.deleteFile(fileId, userId);
    
    if (!deleted) {
      return NextResponse.json(
        { error: "Failed to delete file metadata" },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: "File deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}