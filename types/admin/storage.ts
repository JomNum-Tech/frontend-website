export interface FileItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  uploadedBy: string;
  pathname: string;
}

export interface UploadResponse {
  success: boolean;
  file: FileItem;
}

export interface FilesListResponse {
  success: boolean;
  files: FileItem[];
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

export interface FileUploadProps {
  onFileUploaded: () => void;
}

export interface FileManagerProps {
  refreshTrigger: number;
} 