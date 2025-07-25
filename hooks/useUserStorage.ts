import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { UserFile, StorageStats, UploadProgress } from "@/types/user/storage";
import { useUploadThing } from "@/lib/uploadthing";
import { useUser } from "@clerk/nextjs";

export function useUserStorage() {
  const { user } = useUser();
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress[]>([]);
  const [storageStats, setStorageStats] = useState<StorageStats>({
    totalFiles: 0,
    totalSize: 0,
    maxStorageSize: 20 * 1024 * 1024, // 20MB in bytes
    maxSizePerFile: "8MB",
    usedPercentage: 0,
  });
  const { toast } = useToast();

  // Helper functions defined first
  const formatFileSize = useCallback((bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  }, []);

  const convertStorageSizeToBytes = useCallback(
    (sizeString: string): number => {
      const units: { [key: string]: number } = {
        B: 1,
        KB: 1024,
        MB: 1024 * 1024,
        GB: 1024 * 1024 * 1024,
      };

      const match = sizeString.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
      if (!match) {
        throw new Error(`Invalid storage size format: ${sizeString}`);
      }

      const value = parseFloat(match[1]);
      const unit = match[2].toUpperCase();

      return Math.floor(value * units[unit]);
    },
    []
  );

  const { startUpload, isUploading } = useUploadThing("userStorage", {
    onClientUploadComplete: (res) => {
      if (res) {
        toast({
          title: "Upload successful",
          description: `${res.length} file(s) uploaded successfully`,
        });

        // Refresh files from database after successful upload
        fetchUserFiles();
      }
      setUploading(false);
      setUploadProgress([]);
    },
    onUploadError: (error) => {
      toast({
        title: "Upload failed",
        description: error.message,
        variant: "destructive",
      });
      setUploading(false);
      setUploadProgress([]);
    },
    onUploadBegin: (name) => {
      setUploadProgress((prev) => [...prev, { file: name, progress: 0 }]);
    },
    onUploadProgress: (progress) => {
      // UploadThing doesn't provide per-file progress, so we'll simulate it
      setUploadProgress((prev) =>
        prev.map((p) => ({ ...p, progress: progress }))
      );
    },
  });

  // Fetch user files from database
  const fetchUserFiles = useCallback(async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const response = await fetch("/api/user/storage/files");

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      setFiles(data.files || []);

      // Update storage stats based on user role
      const userRole = (user.publicMetadata?.role as string) || "user";
      const limits = {
        user: { maxStorageSize: "20MB", maxSizePerFile: "8MB" },
        student: { maxStorageSize: "100MB", maxSizePerFile: "10MB" },
        admin: { maxStorageSize: "200MB", maxSizePerFile: "20MB" },
      };

      const userLimits = limits[userRole as keyof typeof limits] || limits.user;

      // Convert storage limit to bytes for calculations
      const maxStorageBytes = convertStorageSizeToBytes(
        userLimits.maxStorageSize
      );
      const usedPercentage = Math.min(
        (data.stats.totalSize / maxStorageBytes) * 100,
        100
      );

      setStorageStats({
        totalFiles: data.stats.totalFiles,
        totalSize: data.stats.totalSize,
        maxStorageSize: maxStorageBytes,
        maxSizePerFile: userLimits.maxSizePerFile,
        usedPercentage,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user, toast, convertStorageSizeToBytes]);

  const uploadFiles = useCallback(
    async (filesToUpload: File[]) => {
      // Check if adding these files would exceed storage limit
      const newFilesTotalSize = filesToUpload.reduce(
        (sum, file) => sum + file.size,
        0
      );
      const wouldExceedLimit =
        storageStats.totalSize + newFilesTotalSize >
        storageStats.maxStorageSize;

      if (wouldExceedLimit) {
        const currentUsage = formatFileSize(storageStats.totalSize);
        const maxStorage = formatFileSize(storageStats.maxStorageSize);
        const newFilesSize = formatFileSize(newFilesTotalSize);

        toast({
          title: "Storage limit exceeded",
          description: `Cannot upload ${newFilesSize}. Current usage: ${currentUsage} / ${maxStorage}`,
          variant: "destructive",
        });
        return;
      }

      // Check individual file size limits
      const maxFileSizeBytes = convertStorageSizeToBytes(
        storageStats.maxSizePerFile
      );
      const oversizedFiles = filesToUpload.filter(
        (file) => file.size > maxFileSizeBytes
      );

      if (oversizedFiles.length > 0) {
        toast({
          title: "File too large",
          description: `Some files exceed the ${storageStats.maxSizePerFile} limit per file`,
          variant: "destructive",
        });
        return;
      }

      setUploading(true);
      await startUpload(filesToUpload);
    },
    [
      storageStats.totalSize,
      storageStats.maxStorageSize,
      storageStats.maxSizePerFile,
      convertStorageSizeToBytes,
      startUpload,
      formatFileSize,
      toast,
    ]
  );

  const deleteFile = useCallback(
    async (fileId: string) => {
      try {
        setLoading(true);

        const response = await fetch(`/api/user/storage/${fileId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete file");
        }

        // Refresh files after deletion
        await fetchUserFiles();

        toast({
          title: "File deleted",
          description: "File has been successfully deleted",
        });
      } catch (error) {
        toast({
          title: "Delete failed",
          description: "Failed to delete file",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [toast, fetchUserFiles]
  );

  const copyFileUrl = useCallback(
    async (url: string) => {
      try {
        await navigator.clipboard.writeText(url);
        toast({
          title: "URL copied",
          description: "File URL copied to clipboard",
        });
      } catch (error) {
        toast({
          title: "Copy failed",
          description: "Failed to copy URL to clipboard",
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  // Load files when component mounts or user changes
  useEffect(() => {
    if (user?.id) {
      fetchUserFiles();
    }
  }, [user?.id, fetchUserFiles]);

  return {
    files,
    loading,
    uploading: uploading || isUploading,
    uploadProgress,
    storageStats,
    uploadFiles,
    deleteFile,
    copyFileUrl,
    formatFileSize,
    refreshFiles: fetchUserFiles,
  };
}
