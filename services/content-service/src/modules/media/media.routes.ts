/**
 * Media routes
 */
import { BadRequestException } from '@common/exceptions';
import { authenticate, requireAdmin } from '@common/middleware';
import { paginationSchema, uploadMediaSchema } from '@common/utils/validation';
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { mediaService } from './media.service';

interface IdParams {
  id: string;
}

export async function mediaRoutes(fastify: FastifyInstance): Promise<void> {
  // Get all media assets (admin only)
  fastify.get(
    '/',
    { preHandler: [authenticate, requireAdmin] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = paginationSchema.parse(request.query);
      const result = await mediaService.findAll(params);
      return reply.send({
        success: true,
        ...result,
      });
    }
  );

  // Get my media assets
  fastify.get(
    '/my',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const params = paginationSchema.parse(request.query);
      const result = await mediaService.findByUploader(request.userId!, params);
      return reply.send({
        success: true,
        ...result,
      });
    }
  );

  // Get media stats (admin only)
  fastify.get(
    '/stats',
    { preHandler: [authenticate, requireAdmin] },
    async (_request: FastifyRequest, reply: FastifyReply) => {
      const stats = await mediaService.getStats();
      return reply.send({
        success: true,
        data: {
          ...stats,
          totalSize: stats.totalSize.toString(), // Convert BigInt to string for JSON
        },
      });
    }
  );

  // Get media asset by ID
  fastify.get<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const asset = await mediaService.findById(request.params.id);
      return reply.send({
        success: true,
        data: {
          ...asset,
          fileSize: asset.fileSize.toString(), // Convert BigInt to string
        },
      });
    }
  );

  // Upload media
  fastify.post(
    '/upload',
    { preHandler: [authenticate] },
    async (request: FastifyRequest, reply: FastifyReply) => {
      const data = await request.file();
      
      if (!data) {
        throw new BadRequestException('No file uploaded');
      }

      // Parse optional fields from form data
      const fields = uploadMediaSchema.parse({
        altText: (data.fields.altText as any)?.value,
      });

      const asset = await mediaService.upload(data, request.userId!, fields.altText);

      return reply.status(201).send({
        success: true,
        data: {
          ...asset,
          fileSize: asset.fileSize.toString(),
        },
      });
    }
  );

  // Update alt text
  fastify.patch<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      const { altText } = request.body as { altText: string };
      const asset = await mediaService.updateAltText(request.params.id, altText);
      return reply.send({
        success: true,
        data: {
          ...asset,
          fileSize: asset.fileSize.toString(),
        },
      });
    }
  );

  // Delete media
  fastify.delete<{ Params: IdParams }>(
    '/:id',
    { preHandler: [authenticate] },
    async (request: FastifyRequest<{ Params: IdParams }>, reply: FastifyReply) => {
      await mediaService.delete(request.params.id);
      return reply.status(204).send();
    }
  );
}
