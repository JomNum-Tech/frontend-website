# Storage Feature Setup Guide

## Overview
The storage feature allows admins to upload and manage files using Vercel Blob storage.

## Prerequisites
1. Vercel account
2. Vercel Blob storage configured

## Environment Variables Setup

### 1. Vercel Blob Configuration
You need to set up the following environment variables:

```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### 2. How to Get Vercel Blob Token

1. Go to your Vercel dashboard
2. Navigate to Storage > Blob
3. Create a new Blob store or use an existing one
4. Copy the `BLOB_READ_WRITE_TOKEN` from the store settings

### 3. Local Development Setup

For local development, create a `.env.local` file in your project root:

```env
BLOB_READ_WRITE_TOKEN=your_vercel_blob_token_here
```

### 4. Production Deployment

For production deployment on Vercel:
1. Go to your project settings in Vercel dashboard
2. Navigate to Environment Variables
3. Add `BLOB_READ_WRITE_TOKEN` with your token value

## Testing the Upload

### 1. Test API Endpoint
You can test if the API is working by visiting:
```
GET /api/admin/storage/test
```

### 2. Test Simple Upload
If Vercel Blob is not configured, you can test with the simple upload endpoint:
```
POST /api/admin/storage/upload-simple
```

## Troubleshooting

### Common Issues

1. **"Storage service not configured" error**
   - Make sure `BLOB_READ_WRITE_TOKEN` is set in your environment variables

2. **"Unauthorized" error**
   - Make sure you're logged in as an admin user
   - Check if Clerk authentication is working properly

3. **"File type not allowed" error**
   - Check if your file type is in the allowed list:
     - Images: jpeg, jpg, png, gif, svg, webp
     - Documents: pdf, doc, docx

4. **"File too large" error**
   - Maximum file size is 10MB
   - Try uploading a smaller file

### Debug Steps

1. Check browser console for JavaScript errors
2. Check server logs for API errors
3. Test with a simple image file first
4. Verify environment variables are loaded correctly

## File Management Features

- **Upload**: Drag & drop or click to select files
- **Preview**: View images and file details
- **Download**: Download files to your device
- **Copy URL**: Copy direct links to files
- **Delete**: Remove files from storage
- **Search**: Find files by name
- **Filter**: Filter by file type
- **Grid/List View**: Toggle between view modes

## Security Notes

- Only authenticated admin users can access the storage feature
- File types are validated on both client and server
- File sizes are limited to 10MB
- All uploads are logged with user information 