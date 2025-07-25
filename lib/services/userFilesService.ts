import { neon } from '@neondatabase/serverless';

const sql = neon(process.env.NEON_DATABASE_URL!);

export interface UserFileRecord {
  id: number;
  user_id: string;
  file_key: string;
  file_name: string;
  file_url: string;
  file_size: number;
  file_type: string;
  uploaded_at: string;
  created_at: string;
  updated_at: string;
}

export interface CreateUserFileData {
  userId: string;
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}

export class UserFilesService {
  // Save file metadata to database
  static async createFile(data: CreateUserFileData): Promise<UserFileRecord> {
    const result = await sql`
      INSERT INTO user_files (user_id, file_key, file_name, file_url, file_size, file_type)
      VALUES (${data.userId}, ${data.fileKey}, ${data.fileName}, ${data.fileUrl}, ${data.fileSize}, ${data.fileType})
      RETURNING *
    `;
    return result[0] as UserFileRecord;
  }

  // Get all files for a specific user
  static async getUserFiles(userId: string): Promise<UserFileRecord[]> {
    const result = await sql`
      SELECT * FROM user_files 
      WHERE user_id = ${userId}
      ORDER BY uploaded_at DESC
    `;
    return result as UserFileRecord[];
  }

  // Get file by key and user ID (for security)
  static async getFileByKey(fileKey: string, userId: string): Promise<UserFileRecord | null> {
    const result = await sql`
      SELECT * FROM user_files 
      WHERE file_key = ${fileKey} AND user_id = ${userId}
      LIMIT 1
    `;
    return result[0] as UserFileRecord || null;
  }

  // Delete file metadata from database
  static async deleteFile(fileKey: string, userId: string): Promise<boolean> {
    const result = await sql`
      DELETE FROM user_files 
      WHERE file_key = ${fileKey} AND user_id = ${userId}
      RETURNING id
    `;
    return result.length > 0;
  }

  // Get user storage statistics
  static async getUserStorageStats(userId: string): Promise<{
    totalFiles: number;
    totalSize: number;
  }> {
    const result = await sql`
      SELECT 
        COUNT(*) as total_files,
        COALESCE(SUM(file_size), 0) as total_size
      FROM user_files 
      WHERE user_id = ${userId}
    `;
    
    const stats = result[0] as { total_files: string; total_size: string };
    return {
      totalFiles: parseInt(stats.total_files),
      totalSize: parseInt(stats.total_size),
    };
  }

  // Check if user has reached file limit (deprecated - use checkUserStorageLimit instead)
  static async checkUserFileLimit(userId: string, maxFiles: number): Promise<boolean> {
    const result = await sql`
      SELECT COUNT(*) as file_count
      FROM user_files 
      WHERE user_id = ${userId}
    `;
    
    const count = parseInt((result[0] as { file_count: string }).file_count);
    return count >= maxFiles;
  }

  // Check if user has reached storage size limit
  static async checkUserStorageLimit(userId: string, maxStorageBytes: number): Promise<boolean> {
    const result = await sql`
      SELECT COALESCE(SUM(file_size), 0) as total_size
      FROM user_files 
      WHERE user_id = ${userId}
    `;
    
    const totalSize = parseInt((result[0] as { total_size: string }).total_size);
    return totalSize >= maxStorageBytes;
  }

  // Check if adding new files would exceed storage limit
  static async checkStorageLimitWithNewFiles(
    userId: string, 
    maxStorageBytes: number, 
    newFileSizes: number[]
  ): Promise<boolean> {
    const stats = await this.getUserStorageStats(userId);
    const newFilesTotalSize = newFileSizes.reduce((sum, size) => sum + size, 0);
    return (stats.totalSize + newFilesTotalSize) > maxStorageBytes;
  }

  // Convert storage size string to bytes
  static convertStorageSizeToBytes(sizeString: string): number {
    const units: { [key: string]: number } = {
      'B': 1,
      'KB': 1024,
      'MB': 1024 * 1024,
      'GB': 1024 * 1024 * 1024,
    };

    const match = sizeString.match(/^(\d+(?:\.\d+)?)\s*(B|KB|MB|GB)$/i);
    if (!match) {
      throw new Error(`Invalid storage size format: ${sizeString}`);
    }

    const value = parseFloat(match[1]);
    const unit = match[2].toUpperCase();
    
    return Math.floor(value * units[unit]);
  }

  // Convert bytes to human readable format
  static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}