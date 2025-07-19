# Design Document: File Upload Enhancement

## Overview

This design document outlines the approach to fix and enhance the file upload component in the admin section of the application. The current implementation has issues with correctly identifying and handling file content types, particularly when files are uploaded via the drop zone. The enhancement will focus on improving the content type detection, providing better visual feedback, and ensuring a more robust upload experience.

## Architecture

The file upload component is a client-side React component that handles file selection, preview generation, and upload to the server. The component uses the react-dropzone library for the drag-and-drop functionality and XMLHttpRequest for the actual file upload process.

The enhancement will maintain this architecture while improving the content type detection and handling logic.

## Components and Interfaces

### FileUpload Component

The main component that will be enhanced is the `FileUpload` component located at `components/admin/storage/FileUpload.tsx`. This component has the following key interfaces:

```typescript
interface FileUploadProps {
  onFileUploaded: (files: UploadedFile[]) => void;
}

interface UploadedFile {
  id: string;
  name: string;
  url: string;
  size: number;
  type: string;
}

interface FileWithPreview extends File {
  preview?: string;
  uploadProgress?: number;
  status?: 'pending' | 'uploading' | 'success' | 'error';
  error?: string;
  uploadedFile?: UploadedFile;
}
```

### Content Type Detection Enhancement

We will enhance the content type detection in the following ways:

1. **Improved MIME Type Detection**: Implement a more robust method to detect and validate file MIME types.
2. **Content Type Validation**: Add validation to ensure the content type matches the actual file content.
3. **Fallback Mechanism**: Implement a fallback mechanism for when the content type cannot be determined from the file object.

### Visual Feedback Enhancements

The visual feedback will be improved by:

1. **Better File Type Icons**: Enhance the `getFileIcon` function to handle more file types and edge cases.
2. **Preview Generation**: Ensure preview generation works correctly for all image types.
3. **Error Handling**: Provide clearer visual feedback for content type-related errors.

## Data Models

The existing data models (`UploadedFile` and `FileWithPreview`) will be maintained, but we'll ensure that the `type` field is always correctly populated.

## Error Handling

The error handling will be enhanced to:

1. **Detect Content Type Issues**: Add specific error detection for content type-related issues.
2. **Provide Clear Error Messages**: Ensure error messages clearly explain content type problems.
3. **Graceful Degradation**: Implement fallback behavior when content type detection fails.

## Testing Strategy

The enhancements will be tested using:

1. **Unit Tests**: Test the content type detection and validation functions in isolation.
2. **Component Tests**: Test the FileUpload component with various file types and scenarios.
3. **Manual Testing**: Perform manual testing with different file types, browsers, and upload methods.

## Implementation Approach

The implementation will focus on:

1. **Minimal Changes**: Make targeted changes to fix the content type detection issue without disrupting the overall component functionality.
2. **Browser Compatibility**: Ensure the solution works across all major browsers.
3. **Performance**: Maintain good performance, especially when handling multiple files.

### Key Implementation Details

1. **Content Type Detection**:
   - Use the File API's `type` property as the primary source.
   - Implement a fallback mechanism using file extensions when the type is empty or generic.
   - Consider using a library like `file-type` or a similar approach for more accurate detection.

2. **FormData Handling**:
   - Ensure the FormData object correctly includes the file with its content type.
   - Add explicit content type information to the FormData when needed.

3. **Server Communication**:
   - Ensure the XMLHttpRequest properly sends content type information.
   - Handle server responses that might include corrected content type information.