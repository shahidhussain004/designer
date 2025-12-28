import { FastifyInstance } from 'fastify';
import { buildApp } from '../../src/app';

describe('App E2E Tests', () => {
  let app: FastifyInstance;

  beforeAll(async () => {
    app = await buildApp();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('Health Endpoints', () => {
    it('GET /health should return service status', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health',
      });

      expect(response.statusCode).toBe(200);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty('status', 'ok');
      expect(body).toHaveProperty('service', 'content-service');
    });

    it('GET /health/ready should check dependencies', async () => {
      const response = await app.inject({
        method: 'GET',
        url: '/health/ready',
      });

      // May be 200 or 503 depending on mock state
      expect([200, 503]).toContain(response.statusCode);
      const body = JSON.parse(response.payload);
      expect(body).toHaveProperty('status');
      expect(body).toHaveProperty('checks');
    });
  });

  describe('API Routes', () => {
    describe('Categories', () => {
      it('GET /api/v1/categories should return categories list', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/categories',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', true);
        expect(body).toHaveProperty('data');
        expect(Array.isArray(body.data)).toBe(true);
      });

      it('GET /api/v1/categories/tree should return category tree', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/categories/tree',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', true);
      });
    });

    describe('Tags', () => {
      it('GET /api/v1/tags should return tags list', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/tags',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', true);
      });

      it('GET /api/v1/tags/popular should return popular tags', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/tags/popular',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', true);
      });
    });

    describe('Content', () => {
      it('GET /api/v1/content should return content list', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/content',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', true);
        expect(body).toHaveProperty('data');
        expect(body).toHaveProperty('meta');
      });

      it('GET /api/v1/content/featured should return featured content', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/content/featured',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', true);
      });

      it('GET /api/v1/content/trending should return trending content', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/content/trending',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', true);
      });

      it('POST /api/v1/content should require authentication', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/api/v1/content',
          payload: {
            title: 'Test Article',
            body: 'Test content',
            type: 'ARTICLE',
          },
        });

        expect(response.statusCode).toBe(401);
      });
    });

    describe('Search', () => {
      it('GET /api/v1/search should search content', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/search?query=test',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', true);
      });

      it('GET /api/v1/search/suggest should return suggestions', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/search/suggest?query=test',
        });

        expect(response.statusCode).toBe(200);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', true);
      });
    });

    describe('Analytics', () => {
      it('POST /api/v1/analytics/view/:id should track views', async () => {
        const response = await app.inject({
          method: 'POST',
          url: '/api/v1/analytics/view/content-1',
        });

        // May be 200 or 404 depending on content existence
        expect([200, 404]).toContain(response.statusCode);
      });

      it('GET /api/v1/analytics/overview should require admin auth', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/analytics/overview',
        });

        expect(response.statusCode).toBe(401);
      });
    });

    describe('Error Handling', () => {
      it('should return 404 for unknown routes', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/unknown-route',
        });

        expect(response.statusCode).toBe(404);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', false);
        expect(body).toHaveProperty('error');
      });

      it('should handle validation errors', async () => {
        const response = await app.inject({
          method: 'GET',
          url: '/api/v1/search?query=a', // Too short
        });

        expect(response.statusCode).toBe(400);
        const body = JSON.parse(response.payload);
        expect(body).toHaveProperty('success', false);
      });
    });
  });
});
