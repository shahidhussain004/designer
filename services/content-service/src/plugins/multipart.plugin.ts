/**
 * Multipart file upload plugin
 */
import { appConfig } from '@config/app.config';
import multipart from '@fastify/multipart';
import { FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';

async function multipartPlugin(fastify: FastifyInstance): Promise<void> {
  await fastify.register(multipart, {
    limits: {
      fileSize: appConfig.imageUpload.maxSize,
      files: 1, // Allow only 1 file per request
      fields: 10, // Allow up to 10 fields
    },
    attachFieldsToBody: false,
  });
}

export default fp(multipartPlugin, {
  name: 'multipart',
});
