// Media Controller
import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import * as fs from 'fs';
import * as path from 'path';
import { UpdateMediaAssetDTO } from '../models/media.model';
import { mediaService } from '../services/media.service';

interface IdParams {
  id: string;
}

interface QueryParams {
  page?: string;
  pageSize?: string;
  folder?: string;
  mime_type?: string;
}

// Upload directory
const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';

export async function mediaController(fastify: FastifyInstance) {
  // Ensure upload directory exists
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }

  // Get all media with filtering
  fastify.get(
    '/',
    async (request: FastifyRequest<{ Querystring: QueryParams }>, reply: FastifyReply) => {
      try {
        const { page = '1', pageSize = '50', folder, mime_type } = request.query;

        const filter: any = {};
        if (folder) filter.folder = folder;
        if (mime_type) filter.mime_type = mime_type;

        const result = await mediaService.getFiltered(filter, parseInt(page), parseInt(pageSize));

        return reply.send({ success: true, ...result });
      } catch (error: any) {
        request.log.error(error);
        return reply.status(500).send({ success: false, error: error.message });
      }
    }
  );

  // Get folders
  fastify.get('/folders', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const folders = await mediaService.getFolders();
      return reply.send({ success: true, data: folders });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get storage stats
  fastify.get('/stats', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const stats = await mediaService.getStorageStats();
      return reply.send({ success: true, data: stats });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Get media by ID
  fastify.get<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const media = await mediaService.getById(parseInt(id));

      if (!media) {
        return reply.status(404).send({ success: false, error: 'Media not found' });
      }

      return reply.send({ success: true, data: media });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Upload media
  fastify.post('/upload', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      const data = await request.file();

      if (!data) {
        return reply.status(400).send({ success: false, error: 'No file uploaded' });
      }

      // Generate unique filename
      const ext = path.extname(data.filename);
      const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}${ext}`;
      const folder = (request.query as any).folder || 'uploads';
      const filePath = path.join(UPLOAD_DIR, folder, filename);

      // Ensure folder exists
      const folderPath = path.join(UPLOAD_DIR, folder);
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }

      // Save file
      const buffer = await data.toBuffer();
      fs.writeFileSync(filePath, buffer);

      // Create media record
      const media = await mediaService.create({
        filename,
        original_filename: data.filename,
        file_path: filePath,
        url: `/uploads/${folder}/${filename}`,
        mime_type: data.mimetype,
        file_size: buffer.length,
        folder,
      });

      return reply.status(201).send({ success: true, data: media });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Update media
  fastify.patch<{ Params: IdParams; Body: UpdateMediaAssetDTO }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const media = await mediaService.update(parseInt(id), request.body);

      if (!media) {
        return reply.status(404).send({ success: false, error: 'Media not found' });
      }

      return reply.send({ success: true, data: media });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });

  // Delete media
  fastify.delete<{ Params: IdParams }>('/:id', async (request, reply) => {
    try {
      const { id } = request.params;
      const media = await mediaService.getById(parseInt(id));

      if (!media) {
        return reply.status(404).send({ success: false, error: 'Media not found' });
      }

      // Delete file from disk
      if (fs.existsSync(media.file_path)) {
        fs.unlinkSync(media.file_path);
      }

      await mediaService.delete(parseInt(id));

      return reply.send({ success: true, message: 'Media deleted' });
    } catch (error: any) {
      request.log.error(error);
      return reply.status(500).send({ success: false, error: error.message });
    }
  });
}

export default mediaController;
