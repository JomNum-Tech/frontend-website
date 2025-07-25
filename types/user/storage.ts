export interface UserFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
}

export interface StorageStats {
  totalFiles: number;
  totalSize: number;
  maxStorageSize: number; // Total storage limit in bytes
  maxSizePerFile: string;
  usedPercentage: number;
}

export interface StorageLimits {
  maxStorageSize: number; // Total storage limit in bytes
  maxSizePerFile: string;
}

export interface UploadProgress {
  file: string;
  progress: number;
}