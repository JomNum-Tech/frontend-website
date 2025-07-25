"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Upload, 
  File, 
  Image as ImageIcon, 
  Download, 
  Copy, 
  Trash2, 
  Cloud,
  HardDrive,
  AlertCircle
} from "lucide-react";
import { useUserStorage } from "@/hooks/useUserStorage";
import Image from "next/image";

export default function CloudStorage() {
  const {
    files,
    loading,
    uploading,
    uploadProgress,
    storageStats,
    uploadFiles,
    deleteFile,
    copyFileUrl,
    formatFileSize,
  } = useUserStorage();

  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (droppedFiles.length > 0) {
        uploadFiles(droppedFiles);
      }
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files).filter(file => 
        file.type.startsWith('image/')
      );
      
      if (selectedFiles.length > 0) {
        uploadFiles(selectedFiles);
      }
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-blue-500" />;
    }
    return <File className="w-5 h-5 text-gray-500" />;
  };

  const isImage = (type: string) => type.startsWith('image/');

  return (
    <div className="space-y-6">
      {/* Storage Stats */}
      <Card className="bg-white border border-blue-200 shadow-md rounded-xl">
        <CardHeader className="pb-2 pt-4 px-6">
          <CardTitle className="flex items-center gap-3 text-blue-800 text-lg font-semibold">
            <Cloud className="w-6 h-6 text-blue-500 drop-shadow" />
            <span>Your Storage</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5 px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-sm">
            <div className="flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-blue-600" />
              <span className="font-semibold text-blue-900">
                {formatFileSize(storageStats.totalSize)}
                <span className="text-blue-400 font-normal"> / </span>
                {formatFileSize(storageStats.maxStorageSize)}
                <span className="ml-1 text-xs text-blue-500 font-normal">used</span>
              </span>
            </div>
            <span className="text-blue-700 font-medium bg-blue-100 rounded px-2 py-0.5">
              {storageStats.totalFiles} {storageStats.totalFiles === 1 ? "file" : "files"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 h-3 rounded-full bg-blue-100 overflow-hidden">
              <div
                className="absolute left-0 top-0 h-full rounded-full transition-all duration-500"
                style={{
                  width: `${storageStats.usedPercentage}%`,
                  background:
                    storageStats.usedPercentage < 75
                      ? "linear-gradient(90deg, #38bdf8 0%, #6366f1 100%)" // cyan-400 to indigo-500
                      : storageStats.usedPercentage < 90
                      ? "linear-gradient(90deg, #facc15 0%, #f59e42 100%)" // yellow-400 to orange-400
                      : "linear-gradient(90deg, #f87171 0%, #ef4444 100%)", // red-400 to red-500
                  boxShadow:
                    storageStats.usedPercentage > 90
                      ? "0 0 8px 2px #ef4444aa"
                      : storageStats.usedPercentage > 75
                      ? "0 0 6px 1px #facc15aa"
                      : "0 0 4px 0 #38bdf8aa",
                }}
              />
            </div>
            <span
              className={`text-xs font-semibold min-w-[40px] text-right ${
                storageStats.usedPercentage < 75
                  ? "text-blue-700"
                  : storageStats.usedPercentage < 90
                  ? "text-yellow-700"
                  : "text-red-700"
              }`}
            >
              {Math.round(storageStats.usedPercentage)}%
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-blue-700 font-medium">
            <span className="flex items-center gap-1 bg-blue-50 rounded px-2 py-0.5">
              <File className="w-3 h-3 text-blue-400" />
              Max file Per Upload: {storageStats.maxSizePerFile}
            </span>
            <span className="flex items-center gap-1 bg-blue-50 rounded px-2 py-0.5">
              <HardDrive className="w-3 h-3 text-blue-400" />
              Total: {formatFileSize(storageStats.maxStorageSize)}
            </span>
            <span className="flex items-center gap-1 bg-blue-50 rounded px-2 py-0.5">
              <ImageIcon className="w-3 h-3 text-blue-400" />
              Images only
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Upload Area */}
      <Card className="shadow-lg border-blue-100">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-700">
            <Upload className="w-5 h-5" />
            <span className="tracking-tight">Upload Images</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`relative border-2 border-dashed rounded-xl p-10 text-center transition-colors cursor-pointer
              ${dragActive
                ? "border-blue-500 bg-blue-100/60 shadow-md"
                : "border-blue-200 hover:border-blue-400 bg-blue-50/50"
              }
              ${uploading ? "pointer-events-none opacity-60" : ""}
            `}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            tabIndex={0}
            role="button"
            aria-label="Upload images"
          >
            <div className="flex flex-col items-center space-y-4">
              <div className={`flex items-center justify-center rounded-full bg-blue-50 ${dragActive ? "ring-2 ring-blue-400" : ""} w-20 h-20 mb-2 transition-all`}>
                <Upload className={`w-10 h-10 ${dragActive ? "text-blue-600" : "text-blue-400"} transition-colors`} />
              </div>
              <div>
                <p className="text-lg font-semibold text-blue-800">
                  {dragActive ? "Release to upload" : "Drop images here or click to upload"}
                </p>
                <p className="text-xs text-blue-500 mt-1">
                  PNG, JPG, GIF &middot; Max {storageStats.maxSizePerFile} per file
                </p>
              </div>
              <button
                type="button"
                className="mt-2 px-4 py-1.5 rounded-md bg-blue-600 text-white text-sm font-medium shadow hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                onClick={e => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                disabled={uploading}
                tabIndex={-1}
              >
                Choose Images
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              className="hidden"
              onChange={handleFileSelect}
              disabled={uploading}
              tabIndex={-1}
            />
            {uploading && (
              <div className="absolute inset-0 bg-white/70 flex flex-col items-center justify-center z-10 rounded-xl">
                <Upload className="w-8 h-8 animate-bounce text-blue-500 mb-2" />
                <span className="text-blue-700 font-medium">Uploading...</span>
              </div>
            )}
          </div>

          {/* Upload Progress */}
          {uploading && uploadProgress.length > 0 && (
            <div className="mt-6 space-y-2">
              <div className="flex items-center justify-between text-sm font-medium">
                <span className="text-blue-700">Uploading...</span>
                <span className="text-blue-700">
                  {uploadProgress[0]?.progress || 0}%
                </span>
              </div>
              <div className="w-full h-3 bg-blue-100 rounded-full overflow-hidden shadow-inner">
                <div
                  className="h-full transition-all duration-300"
                  style={{
                    width: `${uploadProgress[0]?.progress || 0}%`,
                    background: "linear-gradient(90deg, #60a5fa 0%, #6366f1 100%)",
                    borderRadius: "inherit",
                  }}
                />
              </div>
            </div>
          )}

          {/* Storage Warning */}
          {storageStats.usedPercentage > 80 && (
            <div className="mt-6 flex items-center gap-2 text-sm text-amber-800 bg-amber-100 border border-amber-200 rounded-lg p-3 shadow-sm">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>
                <span className="font-semibold">Warning:</span> Storage is {Math.round(storageStats.usedPercentage)}% full. 
                Consider deleting some files.
              </span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Files Grid */}
      {files.length > 0 && (
        <Card className="w-full">
          <CardHeader className="py-3 px-4">
            <CardTitle className="flex items-center gap-2 text-blue-700 text-base">
              <File className="w-4 h-4" />
              My Files ({files.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="py-4 px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="group border border-blue-100 rounded-lg p-3 hover:shadow-lg transition-shadow bg-blue-50/50 flex flex-col h-full"
                  style={{ minHeight: 260 }}
                >
                  {/* File Preview */}
                  <div className="aspect-square mb-2 rounded-md overflow-hidden bg-gray-100 flex items-center justify-center w-full">
                    {isImage(file.type) ? (
                      <Image
                        src={file.url}
                        alt={file.name}
                        width={220}
                        height={220}
                        className="w-full h-full object-cover"
                        style={{ minHeight: 120, minWidth: 120 }}
                      />
                    ) : (
                      <div className="flex items-center justify-center w-full h-full">
                        {getFileIcon(file.type)}
                      </div>
                    )}
                  </div>

                  {/* File Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <h4 className="font-medium text-xs text-gray-900 truncate" title={file.name}>
                        {file.name}
                      </h4>
                      <div className="flex items-center justify-between text-[11px] text-gray-500">
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="secondary" className="text-[10px]">
                          {file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(file.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>

                  {/* File Actions */}
                  <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => window.open(file.url, '_blank')}
                      title="View"
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 p-0"
                      onClick={() => copyFileUrl(file.url)}
                      title="Copy URL"
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 p-0 text-red-500 hover:text-red-700"
                      onClick={() => deleteFile(file.id)}
                      disabled={loading}
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {/* Fill up empty grid cells for layout consistency */}
              {Array.from({
                length:
                  (Math.ceil(files.length / (window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2)) *
                    (window.innerWidth >= 768 ? 4 : window.innerWidth >= 640 ? 3 : 2)) -
                  files.length,
              }).map((_, idx) => (
                <div
                  key={`empty-cell-${idx}`}
                  className="rounded-lg p-3 bg-transparent border border-transparent"
                  aria-hidden="true"
                />
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {files.length === 0 && !uploading && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center space-y-3">
              <Cloud className="w-16 h-16 text-blue-300 mx-auto" />
              <h3 className="text-lg font-medium text-gray-900">No files yet</h3>
              <p className="text-gray-500">
                Upload your first image to get started with cloud storage
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}