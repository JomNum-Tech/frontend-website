"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { 
  Search, 
  Download, 
  Trash2, 
  Copy, 
  Eye, 
  Image as ImageIcon, 
  File,
  Grid3X3,
  List,
  MoreHorizontal
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Image from "next/image";

interface FileManagerProps {
  refreshTrigger: number;
}

interface FileItem {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadedAt: string;
  pathname: string;
  preview?: string; // Add preview field (optional)
}

export function FileManager({ refreshTrigger }: FileManagerProps) {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [selectedFile, setSelectedFile] = useState<FileItem | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    fetchFiles();
  }, [refreshTrigger]);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/storage/files');
      if (!response.ok) {
        throw new Error('Failed to fetch files');
      }
      const data = await response.json();
      // If preview is not present, fallback to url for images
      const filesWithPreview = (data.files || []).map((file: FileItem) => ({
        ...file,
        preview: file.preview || (file.type && file.type.startsWith('image/') ? file.url : undefined)
      }));
      setFiles(filesWithPreview);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load files",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteFile = async (fileId: string) => {
    try {
      const response = await fetch(`/api/admin/storage/files/${fileId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete file');
      }

      toast({
        title: "Success",
        description: "File deleted successfully",
      });

      fetchFiles();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete file",
        variant: "destructive",
      });
    }
  };

  const copyFileUrl = async (url: string) => {
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
  };

  const downloadFile = async (file: FileItem) => {
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
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-6 h-6 text-blue-500" />;
    }
    return <File className="w-6 h-6 text-gray-500" />;
  };

  const filteredFiles = files.filter(file => {
    const matchesSearch = file.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === "all" || file.type.startsWith(filterType);
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search files..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All files</SelectItem>
              <SelectItem value="image/">Images</SelectItem>
              <SelectItem value="application/pdf">PDFs</SelectItem>
              <SelectItem value="application/msword">Documents</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={viewMode === "grid" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("grid")}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "outline"}
            size="sm"
            onClick={() => setViewMode("list")}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* File Count */}
      <div className="text-sm text-gray-600">
        {filteredFiles.length} of {files.length} files
      </div>

      {/* Files Display */}
      {filteredFiles.length === 0 ? (
        <div className="text-center py-12">
          <File className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No files found</h3>
          <p className="text-gray-600">
            {searchTerm || filterType !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Upload some files to get started"
            }
          </p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="group relative bg-white border rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              {/* File Preview */}
              <div className="aspect-square mb-3 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                {file.preview ? (
                  <Image
                    height={300}
                    width={300}
                    src={file.preview}
                    alt={file.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  getFileIcon(file.type)
                )}
              </div>

              {/* File Info */}
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-900 truncate" title={file.name}>
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                </p>
              </div>

              {/* Actions */}
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => setSelectedFile(file)}>
                      <Eye className="w-4 h-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => downloadFile(file)}>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copyFileUrl(file.url)}>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy URL
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => deleteFile(file.id)}
                      className="text-red-600"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-2">
          {filteredFiles.map((file) => (
            <div
              key={file.id}
              className="flex items-center space-x-4 p-4 bg-white border rounded-lg hover:bg-gray-50 transition-colors"
            >
              <div className="flex-shrink-0">
                {file.preview ? (
                  <Image
                    height={48}
                    width={48}
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                    {getFileIcon(file.type)}
                  </div>
                )}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {file.name}
                </p>
                <p className="text-xs text-gray-500">
                  {formatFileSize(file.size)} • {formatDate(file.uploadedAt)}
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedFile(file)}
                >
                  <Eye className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadFile(file)}
                >
                  <Download className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => copyFileUrl(file.url)}
                >
                  <Copy className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteFile(file.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Preview Dialog */}
      <Dialog open={!!selectedFile} onOpenChange={() => setSelectedFile(null)}>
        <DialogContent className="max-w-2xl p-0 overflow-hidden">
          {selectedFile && (
            <div className="flex flex-col md:flex-row">
              {/* Preview Section */}
              <div className="flex items-center justify-center bg-gray-50 md:w-1/2 w-full min-h-[320px] p-6">
                {selectedFile.preview ? (
                  <Image
                    height={320}
                    width={320}
                    src={selectedFile.preview}
                    alt={selectedFile.name}
                    className="w-full h-auto max-h-80 object-contain rounded-lg shadow"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center">
                    <div className="mb-2">{getFileIcon(selectedFile.type)}</div>
                    <span className="text-sm text-gray-500">{selectedFile.type}</span>
                  </div>
                )}
              </div>
              {/* Details & Actions */}
              <div className="flex flex-col justify-between md:w-1/2 w-full p-8 bg-white rounded-r-lg shadow-inner">
                <div>
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold truncate text-gray-900">{selectedFile.name}</DialogTitle>
                    <DialogDescription className="text-sm text-gray-500 mt-2 flex flex-col items-left gap-2">
                      <span>File Size: {formatFileSize(selectedFile.size)}</span>
                      
                      <span>Modified: {formatDate(selectedFile.uploadedAt)}</span>
                    </DialogDescription>
                  </DialogHeader>
                </div>
                <div className="flex flex-col gap-3 mt-8">
                  <Button
                    variant="outline"
                    className="w-full flex items-center justify-center py-3 text-base font-medium transition-colors hover:bg-gray-100 active:bg-gray-200"
                    onClick={() => copyFileUrl(selectedFile.url)}
                  >
                    <Copy className="w-5 h-5 mr-3 text-gray-600" />
                    <span>Copy URL</span>
                  </Button>
                  <Button
                    className="w-full flex items-center justify-center py-3 text-base font-medium bg-blue-600 hover:bg-blue-700 text-white transition-colors"
                    onClick={() => downloadFile(selectedFile)}
                  >
                    <Download className="w-5 h-5 mr-3" />
                    <span>Download</span>
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 