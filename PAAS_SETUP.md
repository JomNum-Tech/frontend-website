# PaaS Hosting Feature Setup

This document explains how to set up and use the mini PaaS (Platform as a Service) hosting feature.

## Overview

The PaaS hosting feature allows developers to:
- Deploy small web projects directly from the profile page
- Support for static HTML, React, Vue, Angular, and Node.js projects
- Automatic subdomain generation (e.g., `my-project.paas.yourdomain.com`)
- File upload via drag & drop
- Real-time deployment status tracking
- Basic analytics (visits, storage usage)

## Setup Instructions

### 1. Database Migration

Run the database migration to create the required table:

```bash
npm run db:migrate:paas
```

### 2. Test the Setup

Verify everything is working:

```bash
node test-paas-api.js
```

### 3. Environment Variables

Make sure your `.env.local` file contains:

```env
DATABASE_URL=your_neon_database_url
```

## Features

### User Limits
- Maximum 5 deployments per user
- Individual files: 10MB total limit per deployment
- ZIP files: 50MB limit per ZIP file
- 100MB total storage limit per user

### Supported Frameworks
- **Static HTML**: Direct deployment of HTML/CSS/JS files
- **React**: Build with `npm run build`, deploy from `build/` or `dist/`
- **Vue.js**: Build with `npm run build`, deploy from `dist/`
- **Angular**: Build with `ng build`, deploy from `dist/`
- **Node.js**: Simple Node.js applications

### Upload Methods
1. **Individual Files**: Upload multiple files via drag & drop (max 10MB total)
2. **ZIP Archive**: Upload a complete project as ZIP file (max 50MB)
   - Auto-detects project type from package.json
   - Extracts and filters files automatically
   - Skips node_modules, .git, and other unwanted files

### Deployment Process
1. User uploads files via drag & drop or ZIP archive
2. System validates file size and user limits
3. For ZIP files: extracts, filters, and auto-detects project type
4. Files are stored and deployment record created
5. Build process simulated (5 second delay)
6. Status updated to "deployed" with live URL

## API Endpoints

### GET `/api/paas/deployments`
- Fetch user's deployments and stats
- Returns: `{ deployments: [], stats: {} }`

### POST `/api/paas/deployments`
- Create new deployment
- Body: FormData with config and files
- Returns: Created deployment object

### DELETE `/api/paas/deployments/[id]`
- Delete a deployment
- Requires ownership verification

### POST `/api/paas/deployments/[id]/start`
- Start/resume a stopped deployment

### POST `/api/paas/deployments/[id]/stop`
- Stop a running deployment

## Usage

1. Navigate to Profile → Hosting tab
2. Click "New Deployment"
3. Fill in project details:
   - Project name (becomes subdomain)
   - Framework type (auto-detected for ZIP files)
   - Build command (if needed)
   - Output directory (if needed)
4. Choose upload method:
   - **Individual Files**: Switch to "Individual Files" tab and drag & drop files
   - **ZIP Archive**: Switch to "ZIP Archive" tab and upload your project ZIP
5. Click "Deploy"
6. Monitor deployment status
7. Access your live site via the generated URL

### ZIP File Benefits
- Upload entire projects at once
- Auto-detection of project type and build settings
- Automatic filtering of unwanted files (node_modules, .git, etc.)
- Support for larger projects (up to 50MB)
- Preserves folder structure

## File Structure

```
types/paas/
  deployment.ts          # TypeScript interfaces

hooks/
  useDeployments.ts      # React hook for deployment management

components/user/
  PaaSHosting.tsx        # Main PaaS UI component

app/api/paas/
  deployments/
    route.ts             # GET/POST deployments
    [id]/
      route.ts           # DELETE deployment
      start/route.ts     # Start deployment
      stop/route.ts      # Stop deployment

db/migrations/
  create-paas-deployments.sql  # Database schema
  run-paas-migration.js        # Migration runner
```

## Security Considerations

- File type validation on upload
- User ownership verification for all operations
- Subdomain sanitization to prevent conflicts
- File size limits to prevent abuse
- User deployment limits

## Future Enhancements

- Custom domain support
- Environment variable management
- Build logs viewing
- Deployment rollback
- Team collaboration
- Advanced analytics
- CI/CD integration
- Database connections
- SSL certificate management

## Troubleshooting

### Common Issues

1. **Database table doesn't exist**
   - Run: `npm run db:migrate:paas`

2. **File upload fails**
   - Check file size (max 10MB)
   - Verify file types are supported

3. **Subdomain conflicts**
   - Choose a unique project name
   - System will show error if subdomain exists

4. **Deployment stuck in "building"**
   - Check server logs
   - Verify build command is correct

### Testing

Run the test script to verify setup:
```bash
node test-paas-api.js
```

This will check:
- Database connection
- Table existence
- Basic CRUD operations
- Data integrity

### Create Test ZIP Files

Generate test ZIP files for testing:
```bash
node create-test-zip.js
```

This creates:
- `test-react-app.zip` - React project with package.json
- `test-static-site.zip` - Static HTML/CSS/JS site

### ZIP File Processing
- Automatically extracts ZIP contents
- Filters out unwanted files (node_modules, .git, .env, etc.)
- Validates file types and sizes
- Auto-detects project framework from package.json
- Preserves folder structure