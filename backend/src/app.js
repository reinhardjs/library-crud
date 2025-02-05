import Fastify from 'fastify';
import cors from '@fastify/cors';

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

  return app;
} 
