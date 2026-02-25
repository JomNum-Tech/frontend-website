# Storage System Setup Guide

## Developer Guide for Setting Up the Storage System

### Overview
This guide covers the complete setup and configuration of the storage system for developers and administrators.

## Prerequisites

### Required Dependencies
```json
{
  "uploadthing": "^6.0.0",
  "@uploadthing/react": "^6.0.0",
  "next": "^14.0.0",
  "react": "^18.0.0",
  "typescript": "^5.0.0"
}
```

### Environment Variables
Create or update your `.env.local` file:
```env
# UploadThing Configuration
UPLOADTHING_SECRET=your_uploadthing_secret_key
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Database (if using custom storage tracking)
DATABASE_URL=your_database_connection_string

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000
```

## Part 1: UploadThing Setup

### Step 1: Create UploadThing Account
1. Visit [uploadthing.com](https://uploadthing.com)
2. Sign up for an account
3. Create a new application
4. Copy your API keys

### Step 2: Configure UploadThing Core
Create `lib/uploadthing.ts`:
```typescript
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { auth } from "@clerk/nextjs";

const f = createUploadthing();

export const ourFileRouter = {
  // User file uploads
  userFiles: f({ 
    image: { maxFileSize: "4MB", maxFileCount: 10 },
    pdf: { maxFileSize: "8MB", maxFileCount: 5 },
    text: { maxFileSize: "2MB", maxFileCount: 20 }
  })
    .middleware(async ({ req }) => {
      const { userId } = auth();
      if (!userId) throw new Error("Unauthorized");
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
```

### Step 3: API Route Setup
Create `app/api/uploadthing/route.ts`:
```typescript
import { createNextRouteHandler } from "uploadthing/next";
import { ourFileRouter } from "@/lib/uploadthing";

export const { GET, POST } = createNextRouteHandler({
  router: ourFileRouter,
});
```

## Part 2: Database Schema

### User Files Table
```sql
CREATE TABLE user_files (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  file_name VARCHAR(255) NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  upload_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT FALSE,
  metadata JSONB
);

CREATE INDEX idx_user_files_user_id ON user_files(user_id);
CREATE INDEX idx_user_files_upload_date ON user_files(upload_date);
```

## Part 3: React Components

### File Upload Component
Create `components/admin/storage/FileUpload.tsx`:
```typescript
"use client";

import { UploadButton } from "@/lib/uploadthing";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface FileUploadProps {
  onUploadComplete?: (files: any[]) => void;
  maxFiles?: number;
}

export function FileUpload({ onUploadComplete, maxFiles = 5 }: FileUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  return (
    <div className="w-full">
      <UploadButton
        endpoint="userFiles"
        onClientUploadComplete={(res) => {
          setIsUploading(false);
          toast({
            title: "Upload successful",
            description: `${res.length} file(s) uploaded successfully.`,
          });
          onUploadComplete?.(res);
        }}
        onUploadError={(error: Error) => {
          setIsUploading(false);
          toast({
            title: "Upload failed",
            description: error.message,
            variant: "destructive",
          });
        }}
        onUploadBegin={() => {
          setIsUploading(true);
        }}
      />
      {isUploading && (
        <div className="mt-2 text-sm text-muted-foreground">
          Uploading files...
        </div>
      )}
    </div>
  );
}
```

## Part 4: API Routes

### User Storage API
Create `app/api/user/storage/files/route.ts`:
```typescript
import { auth } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";
import { getUserFiles, deleteUserFile } from "@/lib/services/userFilesService";

export async function GET() {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const files = await getUserFiles(userId);
    return NextResponse.json(files);
  } catch (error) {
    console.error("Error fetching user files:", error);
    return NextResponse.json(
      { error: "Failed to fetch files" },
      { status: 500 }
    );
  }
}
```

## Part 5: Custom Hooks

### useUserStorage Hook
Create `hooks/useUserStorage.ts`:
```typescript
import { useState, useEffect } from "react";
import { UserFile } from "@/types/user/storage";

export function useUserStorage() {
  const [files, setFiles] = useState<UserFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/user/storage/files");
      if (!response.ok) throw new Error("Failed to fetch files");
      
      const data = await response.json();
      setFiles(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return {
    files,
    loading,
    error,
    refreshFiles: fetchFiles,
  };
}
```

## Part 6: Type Definitions

### Storage Types
Create `types/user/storage.ts`:
```typescript
export interface UserFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
  uploadDate: string;
  userId: string;
}

export interface StorageQuota {
  userId: string;
  totalQuota: number;
  usedStorage: number;
  fileCount: number;
  lastUpdated: string;
}
```

## Part 7: Configuration

### Next.js Configuration
Update `next.config.ts`:
```typescript
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['uploadthing.com', 'utfs.io'],
  },
  experimental: {
    serverActions: true,
  },
};

export default nextConfig;
```

## Part 8: Testing

### Test File Upload
Create `test-storage.js`:
```javascript
// Test file upload functionality
const testFileUpload = async () => {
  const formData = new FormData();
  const file = new File(['test content'], 'test.txt', { type: 'text/plain' });
  formData.append('file', file);

  try {
    const response = await fetch('/api/uploadthing', {
      method: 'POST',
      body: formData,
    });
    
    const result = await response.json();
    console.log('Upload result:', result);
  } catch (error) {
    console.error('Upload failed:', error);
  }
};

testFileUpload();
```

## Part 9: Deployment

### Environment Setup
1. Set up UploadThing production keys
2. Configure database connection
3. Set up proper CORS policies
4. Configure file size limits

### Production Considerations
- Implement rate limiting
- Add virus scanning
- Set up CDN for file delivery
- Monitor storage usage
- Implement backup strategies

---

## Troubleshooting

### Common Issues
1. **Upload fails**: Check API keys and file size limits
2. **Files not displaying**: Verify database connection
3. **Slow uploads**: Check network and server capacity
4. **Permission errors**: Verify authentication middleware

### Support Resources
- UploadThing documentation
- Next.js file upload guides
- Community forums
- GitHub issues

---

*This setup guide is maintained by the development team. Report issues or suggest improvements through the project repository.*