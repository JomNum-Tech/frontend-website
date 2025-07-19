"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { FileManager } from "@/components/admin/storage/FileManager";
import { Upload, FolderOpen } from "lucide-react";
import FileUpload from "@/components/admin/storage/FileUpload";

export default function StoragePage() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleFileUploaded = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="container mx-auto px-12 py-8 space-y-6">
      <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm px-6 py-5 mb-4">
        <div className="flex items-center justify-center bg-blue-100 rounded-full w-14 h-14 mr-4">
          <FolderOpen className="w-7 h-7 text-blue-600" />
        </div>
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight mb-1">Storage Management</h1>
          <p className="text-gray-500 text-base">Easily manage your files and media assets in one place.</p>
        </div>
      </div>

      <Tabs defaultValue="upload" className="space-y-6">
        <TabsList className="flex w-full bg-gray-50 rounded-lg shadow-inner p-1 mb-2">
          <TabsTrigger
            value="upload"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-blue-100 font-medium text-base"
          >
            <Upload className="w-5 h-5" />
            <span>Upload Files</span>
          </TabsTrigger>
          <TabsTrigger
            value="files"
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-md transition-colors data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=inactive]:text-gray-700 data-[state=inactive]:hover:bg-blue-100 font-medium text-base"
          >
            <FolderOpen className="w-5 h-5" />
            <span>File Manager</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-6">
          <Card>
            
            <CardContent>
              <FileUpload />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="space-y-6">
          <Card className="border-2 border-blue-100 shadow-lg rounded-xl">
            <CardHeader className="bg-blue-50 rounded-t-xl px-6 py-4 border-b border-blue-100">
              <CardTitle className="flex items-center gap-2 text-blue-700 text-2xl font-bold">
                <FolderOpen className="w-6 h-6 text-blue-500" />
                File Manager
              </CardTitle>
              <CardDescription className="text-gray-600 mt-1">
                View, organize, and manage your uploaded files.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 bg-white rounded-b-xl">
              <FileManager refreshTrigger={refreshTrigger} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 