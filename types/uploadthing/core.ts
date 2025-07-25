import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth, clerkClient } from "@clerk/nextjs/server";
import { UserFilesService } from "@/lib/services/userFilesService";
const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // User storage endpoint with customizable limits
  userStorage: f({
    image: {
      maxFileSize: "16MB", // Set to highest per-file limit (admin)
      maxFileCount: 100, // Set high enough to not interfere with storage size limits
    },
  })
    .middleware(async ({ files }) => {
      // This code runs on your server before upload
      const { userId } = await auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new Error("Unauthorized");

      // Get user details from Clerk to determine role
      let userRole = "user";
      try {
        const clerk = await clerkClient();
        const user = await clerk.users.getUser(userId);
        userRole = (user.publicMetadata?.role as string) || "user";
      } catch (error) {
        console.warn("Could not fetch user role, defaulting to 'user':", error);
      }

      // Define storage limits based on role (total storage space)
      const storageLimits = {
        user: { maxStorageSize: "50MB", maxSizePerFile: "8MB" },
        premium: { maxStorageSize: "200MB", maxSizePerFile: "10MB" },
        admin: { maxStorageSize: "1GB", maxSizePerFile: "20MB" },
      };

      const userLimits =
        storageLimits[userRole as keyof typeof storageLimits] ||
        storageLimits.user;

      // Convert storage limit to bytes
      const maxStorageBytes = UserFilesService.convertStorageSizeToBytes(userLimits.maxStorageSize);

      // Check individual file size limits
      const maxFileSizeBytes = UserFilesService.convertStorageSizeToBytes(userLimits.maxSizePerFile);
      for (const file of files) {
        if (file.size > maxFileSizeBytes) {
          throw new Error(
            `File "${file.name}" is too large. Maximum ${userLimits.maxSizePerFile} per file allowed for ${userRole} users.`
          );
        }
      }

      // Check if adding these files would exceed storage limit
      const fileSizes = files.map(f => f.size);
      const wouldExceedLimit = await UserFilesService.checkStorageLimitWithNewFiles(
        userId,
        maxStorageBytes,
        fileSizes
      );
      if (wouldExceedLimit) {
        const stats = await UserFilesService.getUserStorageStats(userId);
        const currentUsage = UserFilesService.formatBytes(stats.totalSize);
        const maxStorage = UserFilesService.formatBytes(maxStorageBytes);
        throw new Error(
          `Storage limit would be exceeded. Current usage: ${currentUsage} / ${maxStorage}. Cannot upload ${files.length} file(s).`
        );
      }
      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return {
        userId,
        userRole,
        limits: userLimits,
      };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.appUrl);
      console.log("File key:", file.key);

      try {
        // Save file metadata to database with user-specific organization
        await UserFilesService.createFile({
          userId: metadata.userId,
          fileKey: file.key, // Use the actual UploadThing file key
          fileName: file.name,
          fileUrl: file.appUrl, // Use appUrl instead of deprecated url
          fileSize: file.size,
          fileType: file.type || "unknown",
        });

        console.log(
          "File metadata saved to database for user:",
          metadata.userId
        );
      } catch (error) {
        console.error("Failed to save file metadata to database:", error);
        // Don't throw error here to avoid breaking the upload flow
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return {
        uploadedBy: metadata.userId,
        url: file.appUrl, // Use appUrl instead of deprecated url
        name: file.name,
        size: file.size,
        type: file.type || "unknown",
        uploadedAt: new Date().toISOString(),
        key: file.key, // Include file key for deletion
        userFolder: `user-storage/${metadata.userId}`,
      };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
