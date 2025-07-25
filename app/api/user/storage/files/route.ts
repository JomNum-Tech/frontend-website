import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { UserFilesService } from "@/lib/services/userFilesService";

export async function GET() {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user files from database
    const files = await UserFilesService.getUserFiles(userId);
    
    // Get storage statistics
    const stats = await UserFilesService.getUserStorageStats(userId);

    // Transform database records to match frontend interface
    const transformedFiles = files.map(file => ({
      id: file.file_key,
      name: file.file_name,
      url: file.file_url,
      size: file.file_size,
      type: file.file_type,
      uploadedAt: file.uploaded_at,
      uploadedBy: file.user_id,
    }));

    return NextResponse.json({
      success: true,
      files: transformedFiles,
      stats,
    });
  } catch (error) {
    console.error("Error fetching user files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}