"use client"

import type React from "react"

import { useState, useRef } from "react"
import type { PutBlobResult } from "@vercel/blob"
import { upload } from "@vercel/blob/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, File, CheckCircle, AlertCircle, X } from "lucide-react"

interface UploadedFile {
  blob: PutBlobResult
  file: File
}

export default function FileUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null)
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(Array.from(e.dataTransfer.files))
    }
  }

  const handleFiles = async (files: File[]) => {
    setError(null)
    setIsUploading(true)
    setUploadProgress(0)

    try {
      const uploadPromises = files.map(async (file, index) => {
        const newBlob = await upload(file.name, file, {
          access: "public",
          handleUploadUrl: "/api/admin/storage/upload",
          multipart: file.size > 20 * 1024 * 1024, // Use multipart for files > 20MB
        })

        // Simulate progress for demo purposes
        setUploadProgress(((index + 1) / files.length) * 100)

        return { blob: newBlob, file }
      })

      const results = await Promise.all(uploadPromises)
      setUploadedFiles((prev) => [...prev, ...results])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
      if (inputFileRef.current) {
        inputFileRef.current.value = ""
      }
    }
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!inputFileRef.current?.files?.length) {
      setError("Please select at least one file")
      return
    }

    const files = Array.from(inputFileRef.current.files)
    await handleFiles(files)
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  return (
    <div className="container mx-auto py-10 px-4 max-w-3xl">
      <div className="grid gap-8">
        {/* Upload Form */}
        <Card className="shadow-xl border-0 bg-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
              <Upload className="w-6 h-6 text-blue-600" />
              <span>Upload Files</span>
            </CardTitle>
            <CardDescription className="text-base text-blue-500/80">
              Drag and drop files below or click to select. Supports any file type up to 5TB.
            </CardDescription>
          </CardHeader>
          <CardContent className="my-4">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div
                className={`relative border-2 border-dashed rounded-2xl p-10 text-center transition-colors cursor-pointer group
                  ${dragActive
                    ? "border-blue-600 bg-blue-50 shadow-lg"
                    : "border-blue-200 hover:border-blue-400 bg-blue-50/60"
                  }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => inputFileRef.current?.click()}
                tabIndex={0}
                role="button"
                aria-label="File upload area"
              >
                <div className="flex flex-col items-center justify-center space-y-2">
                  <Upload className={`w-16 h-16 mb-2 ${dragActive ? "text-blue-600" : "text-blue-400"} transition-colors`} />
                  <Label htmlFor="file-upload" className="cursor-pointer text-lg font-semibold text-blue-700 group-hover:text-blue-800 transition-colors">
                    Click to <span className="underline underline-offset-2 decoration-blue-400">upload</span> <span className="text-blue-400 font-normal">or drag and drop</span>
                  </Label>
                  <Input
                    id="file-upload"
                    ref={inputFileRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) {
                        handleFiles(Array.from(e.target.files))
                      }
                    }}
                  />
                  <p className="text-sm text-blue-400 mt-1">Any file type, up to 5TB per file</p>
                </div>
                {dragActive && (
                  <div className="absolute inset-0 bg-blue-100/60 border-2 border-blue-600 rounded-2xl pointer-events-none animate-pulse" />
                )}
              </div>

              {error && (
                <div className="flex items-center gap-2 text-sm text-red-700 bg-red-100 border border-red-200 rounded-md px-3 py-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {isUploading && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-blue-700">Uploading...</span>
                    <span className="text-blue-700">{Math.round(uploadProgress)}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full h-2 rounded-full bg-blue-100" />
                </div>
              )}

              <Button
                type="submit"
                disabled={isUploading}
                className={`w-full py-2 text-base font-semibold rounded-lg shadow-md transition-all
                  ${isUploading
                    ? "bg-blue-300 text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                  }
                `}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <Upload className="w-4 h-4 animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  "Upload Files"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg text-blue-700">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Uploaded Files <span className="text-blue-400 font-normal">({uploadedFiles.length})</span>
              </CardTitle>
              <CardDescription className="text-base text-blue-500/80">
                Successfully uploaded files are listed below.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {uploadedFiles.map((uploadedFile, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 border border-blue-100 rounded-xl bg-blue-50 hover:bg-blue-100 transition-colors group"
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <File className="w-8 h-8 text-blue-500 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate text-base group-hover:text-blue-700 transition-colors">
                          {uploadedFile.file.name}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-blue-400 mt-1">
                          <span>{formatFileSize(uploadedFile.file.size)}</span>
                          <Badge variant="secondary" className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700 border border-blue-200">
                            {uploadedFile.file.type || "Unknown type"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        asChild
                        className="rounded-md px-3 py-1 text-sm font-medium border-blue-300 text-blue-700 hover:bg-blue-100 hover:text-blue-900 transition-colors"
                      >
                        <a href={uploadedFile.blob.url} target="_blank" rel="noopener noreferrer">
                          View
                        </a>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full hover:bg-red-100"
                        onClick={() => removeFile(index)}
                        aria-label="Remove file"
                      >
                        <X className="w-4 h-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
