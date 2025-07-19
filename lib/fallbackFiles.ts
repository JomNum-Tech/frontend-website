   // lib/fallbackFiles.ts
   let fallbackFiles: Array<{
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: string;
    pathname: string;
    storageType: string;
    uploadedBy: string;
  }> = [];

  export function addFallbackFile(fileMetadata: {
    id: string;
    name: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: string;
    pathname: string;
    storageType: string;
    uploadedBy: string;
  }) {
    fallbackFiles.push(fileMetadata);
  }

  export function removeFallbackFile(fileId: string) {
    fallbackFiles = fallbackFiles.filter(file => file.id !== fileId);
  }

  export function getFallbackFiles() {
    return fallbackFiles;
  }