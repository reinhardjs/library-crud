import Fastify from 'fastify';
import cors from '@fastify/cors';
import bookRoutes from './routes/bookRoutes.js';

export async function build() {
  const app = Fastify({
    logger: true,
    trustProxy: true
  });

  // Register CORS
  await app.register(cors, {
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });

  // Register routes
  await app.register(bookRoutes, { prefix: '/v1/books' });

  return app;
} 
