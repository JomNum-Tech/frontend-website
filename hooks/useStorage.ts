import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { FileItem, UploadResponse, FilesListResponse, DeleteResponse } from '@/types/admin/storage';

export function useStorage() {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState<FileItem[]>([]);
  const { toast } = useToast();

  const uploadFile = useCallback(async (file: File): Promise<FileItem | null> => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/admin/storage/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Upload failed');
      }

      const result: UploadResponse = await response.json();
      return result.file;
    } catch (error) {
      toast({
        title: "Upload failed",
        description: error instanceof Error ? error.message : "Failed to upload file",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const fetchFiles = useCallback(async (): Promise<FileItem[]> => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/storage/files');
      
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }

      const result: FilesListResponse = await response.json();
      setFiles(result.files);
      return result.files;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
      return [];
    } finally {
      setLoading(false);
    }
  }, [toast]);

  const deleteFile = useCallback(async (fileId: string): Promise<boolean> => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/storage/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      const result: DeleteResponse = await response.json();
      
      toast({
        title: "Success",
        description: result.message,
      });

      // Refresh files list
      await fetchFiles();
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
      return false;
    } finally {
      setLoading(false);
    }
  }, [toast, fetchFiles]);

  const copyFileUrl = useCallback(async (url: string): Promise<void> => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Copied",
        description: "File URL copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy URL",
        variant: "destructive",
      });
    }
  }, [toast]);

  const downloadFile = useCallback(async (file: FileItem): Promise<void> => {
    try {
      const response = await fetch(file.url);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  }, [toast]);

  return {
    loading,
    files,
    uploadFile,
    fetchFiles,
    deleteFile,
    copyFileUrl,
    downloadFile,
  };
} 