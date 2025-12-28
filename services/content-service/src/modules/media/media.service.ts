/**
 * Media service
 */
import { NotFoundException } from '@common/exceptions';
import { PaginatedResult, PaginationParams } from '@common/interfaces';
import { buildPaginationMeta, normalizePagination } from '@common/utils';
import { logger } from '@config/logger.config';
import { MultipartFile } from '@fastify/multipart';
import { prisma } from '@infrastructure/database';
import { storageService, UploadResult } from '@infrastructure/storage';
import { MediaAsset } from '@prisma/client';

export class MediaService {
  async findAll(
    params: PaginationParams = {}
  ): Promise<PaginatedResult<MediaAsset>> {
    const { page, limit, sortOrder } = normalizePagination(params);
    const skip = (page - 1) * limit;

    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      prisma.mediaAsset.count(),
    ]);

    return {
      data: assets,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async findById(id: string): Promise<MediaAsset> {
    const asset = await prisma.mediaAsset.findUnique({
      where: { id },
    });

    if (!asset) {
      throw new NotFoundException('Media asset', id);
    }

    return asset;
  }

  async findByUploader(
    uploadedBy: string,
    params: PaginationParams = {}
  ): Promise<PaginatedResult<MediaAsset>> {
    const { page, limit, sortOrder } = normalizePagination(params);
    const skip = (page - 1) * limit;

    const [assets, total] = await Promise.all([
      prisma.mediaAsset.findMany({
        where: { uploadedBy },
        skip,
        take: limit,
        orderBy: { createdAt: sortOrder },
      }),
      prisma.mediaAsset.count({ where: { uploadedBy } }),
    ]);

    return {
      data: assets,
      meta: buildPaginationMeta(total, page, limit),
    };
  }

  async upload(
    file: MultipartFile,
    uploadedBy: string,
    altText?: string
  ): Promise<MediaAsset> {
    // Upload file to storage
    const result: UploadResult = await storageService.uploadFile(file);

    // Create thumbnail if it's an image
    if (result.mimeType.startsWith('image/')) {
      try {
        await storageService.createThumbnail(result.filename);
      } catch (error) {
        logger.warn({ error, filename: result.filename }, 'Failed to create thumbnail');
      }
    }

    // Save to database
    const asset = await prisma.mediaAsset.create({
      data: {
        filename: result.filename,
        originalFilename: result.originalFilename,
        filePath: result.filePath,
        fileSize: BigInt(result.fileSize),
        mimeType: result.mimeType,
        width: result.width,
        height: result.height,
        uploadedBy,
        altText,
      },
    });

    logger.info({ assetId: asset.id, uploadedBy }, 'Media asset uploaded');

    return asset;
  }

  async updateAltText(id: string, altText: string): Promise<MediaAsset> {
    const existing = await this.findById(id);

    return prisma.mediaAsset.update({
      where: { id },
      data: { altText },
    });
  }

  async delete(id: string): Promise<void> {
    const asset = await this.findById(id);

    // Delete from storage
    await storageService.deleteFile(asset.filePath);

    // Delete thumbnail if exists
    const thumbnailPath = asset.filePath.replace('/images/', '/thumbnails/').replace(asset.filename, `thumb_${asset.filename}`);
    await storageService.deleteFile(thumbnailPath);

    // Delete from database
    await prisma.mediaAsset.delete({
      where: { id },
    });

    logger.info({ assetId: id }, 'Media asset deleted');
  }

  async getStats(): Promise<{
    totalAssets: number;
    totalSize: bigint;
    byMimeType: Record<string, number>;
  }> {
    const [totalAssets, totalSizeResult, byMimeType] = await Promise.all([
      prisma.mediaAsset.count(),
      prisma.mediaAsset.aggregate({
        _sum: { fileSize: true },
      }),
      prisma.mediaAsset.groupBy({
        by: ['mimeType'],
        _count: true,
      }),
    ]);

    const mimeTypeMap: Record<string, number> = {};
    byMimeType.forEach((item) => {
      mimeTypeMap[item.mimeType] = item._count;
    });

    return {
      totalAssets,
      totalSize: totalSizeResult._sum.fileSize || BigInt(0),
      byMimeType: mimeTypeMap,
    };
  }
}

export const mediaService = new MediaService();
