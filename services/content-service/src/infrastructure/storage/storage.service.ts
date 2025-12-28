/**
 * File storage service for media assets
 */
import { BadRequestException } from '@common/exceptions';
import { appConfig } from '@config/app.config';
import { logger } from '@config/logger.config';
import { MultipartFile } from '@fastify/multipart';
import { createWriteStream } from 'fs';
import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import { pipeline } from 'stream/promises';
import { v4 as uuidv4 } from 'uuid';

export interface UploadResult {
  filename: string;
  originalFilename: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
  width?: number;
  height?: number;
}

export interface ImageResizeOptions {
  width?: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  quality?: number;
}

class StorageService {
  private static instance: StorageService;
  private uploadPath: string;
  private allowedMimeTypes: string[];
  private maxFileSize: number;

  private constructor() {
    this.uploadPath = appConfig.imageUpload.path;
    this.allowedMimeTypes = appConfig.imageUpload.allowedMimeTypes;
    this.maxFileSize = appConfig.imageUpload.maxSize;
  }

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  /**
   * Initialize storage directories
   */
  async init(): Promise<void> {
    const directories = [
      this.uploadPath,
      path.join(this.uploadPath, 'images'),
      path.join(this.uploadPath, 'thumbnails'),
      path.join(this.uploadPath, 'temp'),
    ];

    for (const dir of directories) {
      await fs.mkdir(dir, { recursive: true });
    }

    logger.info({ path: this.uploadPath }, 'Storage directories initialized');
  }

  /**
   * Upload a file from multipart
   */
  async uploadFile(file: MultipartFile): Promise<UploadResult> {
    // Validate mime type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException(
        `Invalid file type. Allowed types: ${this.allowedMimeTypes.join(', ')}`
      );
    }

    const ext = path.extname(file.filename).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    const filePath = path.join(this.uploadPath, 'images', filename);

    try {
      // Stream file to disk
      const writeStream = createWriteStream(filePath);
      await pipeline(file.file, writeStream);

      // Get file stats
      const stats = await fs.stat(filePath);

      if (stats.size > this.maxFileSize) {
        await fs.unlink(filePath);
        throw new BadRequestException(
          `File too large. Maximum size: ${this.maxFileSize / (1024 * 1024)}MB`
        );
      }

      // Get image dimensions if it's an image
      let width: number | undefined;
      let height: number | undefined;

      if (file.mimetype.startsWith('image/')) {
        const metadata = await sharp(filePath).metadata();
        width = metadata.width;
        height = metadata.height;
      }

      return {
        filename,
        originalFilename: file.filename,
        filePath: `/uploads/images/${filename}`,
        fileSize: stats.size,
        mimeType: file.mimetype,
        width,
        height,
      };
    } catch (error) {
      // Cleanup on error
      try {
        await fs.unlink(filePath);
      } catch {
        // Ignore cleanup errors
      }
      throw error;
    }
  }

  /**
   * Resize an image and save as thumbnail
   */
  async createThumbnail(
    filename: string,
    options: ImageResizeOptions = {}
  ): Promise<string> {
    const {
      width = 300,
      height = 200,
      fit = 'cover',
      quality = 80,
    } = options;

    const sourcePath = path.join(this.uploadPath, 'images', filename);
    const thumbnailFilename = `thumb_${filename}`;
    const thumbnailPath = path.join(this.uploadPath, 'thumbnails', thumbnailFilename);

    try {
      await sharp(sourcePath)
        .resize(width, height, { fit })
        .jpeg({ quality })
        .toFile(thumbnailPath);

      return `/uploads/thumbnails/${thumbnailFilename}`;
    } catch (error) {
      logger.error({ error, filename }, 'Failed to create thumbnail');
      throw error;
    }
  }

  /**
   * Delete a file
   */
  async deleteFile(filePath: string): Promise<void> {
    const fullPath = path.join(this.uploadPath, filePath.replace('/uploads/', ''));

    try {
      await fs.unlink(fullPath);
      logger.debug({ filePath }, 'File deleted');
    } catch (error) {
      logger.warn({ error, filePath }, 'Failed to delete file');
    }
  }

  /**
   * Check if file exists
   */
  async fileExists(filePath: string): Promise<boolean> {
    const fullPath = path.join(this.uploadPath, filePath.replace('/uploads/', ''));

    try {
      await fs.access(fullPath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get file buffer
   */
  async getFileBuffer(filePath: string): Promise<Buffer> {
    const fullPath = path.join(this.uploadPath, filePath.replace('/uploads/', ''));
    return fs.readFile(fullPath);
  }
}

export const storageService = StorageService.getInstance();
