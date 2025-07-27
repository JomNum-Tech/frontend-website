import JSZip from 'jszip';

export interface ExtractedFile {
  name: string;
  content: Buffer;
  size: number;
  isDirectory: boolean;
}

export async function extractZipFile(zipBuffer: Buffer): Promise<ExtractedFile[]> {
  try {
    const zip = new JSZip();
    const zipContent = await zip.loadAsync(zipBuffer);
    const extractedFiles: ExtractedFile[] = [];

    // Process each file in the ZIP
    for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
      // Skip directories and hidden files
      if (zipEntry.dir || relativePath.startsWith('.') || relativePath.includes('/.')) {
        continue;
      }

      // Skip common unwanted files
      const unwantedPatterns = [
        'node_modules/',
        '.git/',
        '.DS_Store',
        'Thumbs.db',
        '.env',
        '.env.local',
        '.env.production',
        '.env.development',
        '*.log',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml'
      ];

      const shouldSkip = unwantedPatterns.some(pattern => {
        if (pattern.endsWith('/')) {
          return relativePath.startsWith(pattern);
        }
        if (pattern.includes('*')) {
          const regex = new RegExp(pattern.replace('*', '.*'));
          return regex.test(relativePath);
        }
        return relativePath.includes(pattern);
      });

      if (shouldSkip) {
        continue;
      }

      // Extract file content
      const content = await zipEntry.async('nodebuffer');
      
      // Validate file size (max 5MB per file)
      if (content.length > 5 * 1024 * 1024) {
        throw new Error(`File ${relativePath} is too large (max 5MB per file)`);
      }

      // Validate file type
      const allowedExtensions = [
        '.html', '.htm', '.css', '.js', '.jsx', '.ts', '.tsx',
        '.json', '.md', '.txt', '.xml', '.svg', '.png', '.jpg',
        '.jpeg', '.gif', '.ico', '.woff', '.woff2', '.ttf',
        '.eot', '.otf', '.webp', '.mp4', '.webm', '.mp3',
        '.wav', '.pdf', '.zip', '.tar', '.gz'
      ];

      const fileExtension = '.' + relativePath.split('.').pop()?.toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        console.warn(`Skipping unsupported file type: ${relativePath}`);
        continue;
      }

      extractedFiles.push({
        name: relativePath,
        content,
        size: content.length,
        isDirectory: false
      });
    }

    // Validate total extracted size (max 50MB)
    const totalSize = extractedFiles.reduce((sum, file) => sum + file.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      throw new Error('Extracted files exceed 50MB limit');
    }

    // Ensure we have at least one file
    if (extractedFiles.length === 0) {
      throw new Error('No valid files found in ZIP archive');
    }

    return extractedFiles;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to extract ZIP file: ${error.message}`);
    }
    throw new Error('Failed to extract ZIP file: Unknown error');
  }
}

export function detectProjectType(files: ExtractedFile[]): {
  framework: 'static' | 'react' | 'vue' | 'angular' | 'node';
  buildCommand?: string;
  outputDir?: string;
} {
  const fileNames = files.map(f => f.name.toLowerCase());
  
  // Check for package.json to determine if it's a Node.js project
  const hasPackageJson = fileNames.some(name => name.endsWith('package.json'));
  
  if (hasPackageJson) {
    // Try to read package.json to determine framework
    const packageJsonFile = files.find(f => f.name.toLowerCase().endsWith('package.json'));
    if (packageJsonFile) {
      try {
        const packageJson = JSON.parse(packageJsonFile.content.toString('utf8'));
        const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        // React detection
        if (dependencies.react || dependencies['@types/react']) {
          return {
            framework: 'react',
            buildCommand: 'npm run build',
            outputDir: 'build'
          };
        }
        
        // Vue detection
        if (dependencies.vue || dependencies['@vue/cli-service']) {
          return {
            framework: 'vue',
            buildCommand: 'npm run build',
            outputDir: 'dist'
          };
        }
        
        // Angular detection
        if (dependencies['@angular/core'] || dependencies['@angular/cli']) {
          return {
            framework: 'angular',
            buildCommand: 'ng build',
            outputDir: 'dist'
          };
        }
        
        // Node.js detection
        if (dependencies.express || dependencies.fastify || dependencies.koa) {
          return {
            framework: 'node',
            buildCommand: 'npm start'
          };
        }
      } catch (error) {
        console.warn('Failed to parse package.json:', error);
      }
    }
  }
  
  // Check for Angular specific files
  if (fileNames.some(name => name.includes('angular.json') || name.includes('ng-'))) {
    return {
      framework: 'angular',
      buildCommand: 'ng build',
      outputDir: 'dist'
    };
  }
  
  // Check for Vue specific files
  if (fileNames.some(name => name.includes('vue.config.js') || name.includes('.vue'))) {
    return {
      framework: 'vue',
      buildCommand: 'npm run build',
      outputDir: 'dist'
    };
  }
  
  // Default to static if we have HTML files
  if (fileNames.some(name => name.endsWith('.html'))) {
    return {
      framework: 'static'
    };
  }
  
  // Default fallback
  return {
    framework: 'static'
  };
}