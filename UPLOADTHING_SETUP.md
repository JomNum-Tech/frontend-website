# UploadThing Setup Instructions

## 1. Create UploadThing Account
1. Go to [uploadthing.com](https://uploadthing.com)
2. Sign up for an account
3. Create a new app

## 2. Get API Keys
1. In your UploadThing dashboard, go to API Keys
2. Copy your Secret Key and App ID
3. Update the `.env.local` file with your actual keys:

```env
UPLOADTHING_SECRET=sk_live_your_actual_secret_key_here
UPLOADTHING_APP_ID=your_actual_app_id_here
```

## 3. Database Setup
Run the migration to create the user files table:

```bash
npm run db:migrate:user-files
```

This creates the `user_files` table to store file metadata for each user.

## 4. Features Included

### User-Specific Storage
- **File Organization**: Files are stored in user-specific folders (`user-storage/{userId}/`)
- **Database Tracking**: File metadata stored in PostgreSQL for each user
- **Secure Access**: Users can only access their own files
- **Role-Based Limits**: Storage limits based on user role from Clerk metadata

### User Storage Limits
- **Regular Users**: 50MB total storage, 8MB max per file
- **Premium Users**: 200MB total storage, 10MB max per file  
- **Admin Users**: 1GB total storage, 20MB max per file

### Storage Features
- ✅ Drag & drop image upload
- ✅ File preview with thumbnails
- ✅ Storage usage tracking
- ✅ File deletion
- ✅ Copy file URLs
- ✅ Download files
- ✅ Responsive design
- ✅ Role-based storage limits

### File Types Supported
- Images only (PNG, JPG, GIF, WebP)
- Configurable file size limits
- Automatic file type validation

## 5. File Structure
```
user-storage/
├── user_2abc123def/          # User 1's folder
│   ├── 1704067200000-image1.jpg
│   └── 1704067300000-image2.png
├── user_2xyz789ghi/          # User 2's folder
│   ├── 1704067400000-photo1.jpg
│   └── 1704067500000-photo2.gif
└── ...
```

## 6. Database Schema
```sql
user_files (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,     -- Clerk user ID
  file_key VARCHAR(500) NOT NULL,    -- UploadThing file key
  file_name VARCHAR(255) NOT NULL,   -- Original filename
  file_url TEXT NOT NULL,            -- UploadThing file URL
  file_size BIGINT NOT NULL,         -- File size in bytes
  file_type VARCHAR(100) NOT NULL,   -- MIME type
  uploaded_at TIMESTAMP DEFAULT NOW,
  created_at TIMESTAMP DEFAULT NOW,
  updated_at TIMESTAMP DEFAULT NOW
)
```

## 7. Customization

### Modify Storage Limits
Edit `app/api/uploadthing/core.ts` to change storage limits:

```typescript
const storageLimits = {
  user: { maxStorageSize: "50MB", maxSizePerFile: "8MB" },
  premium: { maxStorageSize: "200MB", maxSizePerFile: "10MB" },
  admin: { maxStorageSize: "1GB", maxSizePerFile: "20MB" },
};
```

### Add More File Types
Update the file router in `app/api/uploadthing/core.ts`:

```typescript
userStorage: f({
  image: { maxFileSize: "4MB", maxFileCount: 10 },
  pdf: { maxFileSize: "8MB", maxFileCount: 5 },
})
```

## 8. Usage
1. Go to Profile → Storage tab
2. Drag and drop images or click to upload
3. View storage usage and manage files
4. Copy URLs or download files as needed

## 9. Security
- User authentication required via Clerk
- File access controlled by UploadThing
- Automatic file cleanup on deletion
- Role-based access control
- User isolation (users can only access their own files)
- Database-level security with user ID verification
- Automatic file cleanup on deletion
#
# 10. Troubleshooting

### Database Issues

1. **Test database connection:**
   ```bash
   node test-db-connection.js
   ```

2. **Test storage service:**
   Visit `/api/test-storage` in your browser (while logged in)

3. **Common Issues:**
   - **"user_files table does not exist"**: Run `npm run db:migrate:user-files`
   - **"Storage limit reached"**: User has exceeded their total storage quota
   - **"File too large"**: Individual file exceeds the per-file size limit
   - **"Unauthorized"**: Ensure user is logged in via Clerk

### UploadThing Issues

1. **"onBeforeUpload is not a function"**: This has been fixed - the method was removed
2. **Upload fails**: Check UploadThing API keys in `.env.local`
3. **Files not showing**: Check browser console for API errors

### File Organization

- Files are logically organized by user ID in the database
- Physical file storage is handled by UploadThing
- User isolation is enforced at the API level
- File access is controlled by Clerk authentication

The system provides enterprise-level file organization with proper user isolation, security, and scalability. Each user gets their own private cloud storage space with role-based limits and comprehensive file management capabilities!