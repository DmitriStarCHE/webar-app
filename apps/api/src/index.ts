import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import multipart from '@fastify/multipart';
import { env } from './config/env.js';
import { errorHandler } from './middlewares/error-handler.js';

// Plugins
import prismaPlugin from './plugins/prisma.js';
import jwtPlugin from './plugins/jwt.js';

// Routes
import authRoutes from './routes/auth.js';
import projectRoutes from './routes/projects.js';
import scenesRoutes from './routes/scenes.js';
import publicRoutes from './routes/public.js';

const fastify = Fastify({
  logger: {
    level: env.NODE_ENV === 'development' ? 'info' : 'warn',
    transport:
      env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

async function start() {
  try {
    // Register plugins
    await fastify.register(helmet, {
      contentSecurityPolicy: false, // Disable for development
    });

    await fastify.register(cors, {
      origin: env.ALLOWED_ORIGINS,
      credentials: true,
    });

    await fastify.register(rateLimit, {
      max: env.RATE_LIMIT_MAX,
      timeWindow: env.RATE_LIMIT_WINDOW,
    });

    await fastify.register(multipart, {
      limits: {
        fileSize: env.MAX_FILE_SIZE_MB * 1024 * 1024, // Convert MB to bytes
      },
    });

    // Register custom plugins
    await fastify.register(prismaPlugin);
    await fastify.register(jwtPlugin);

    // Set error handler
    fastify.setErrorHandler(errorHandler);

    // Health check
    fastify.get('/health', async () => {
      return {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      };
    });

    // Register routes
    await fastify.register(authRoutes, { prefix: '/api/auth' });
    await fastify.register(projectRoutes, { prefix: '/api/projects' });
    await fastify.register(scenesRoutes, { prefix: '/api/scenes' });
    await fastify.register(publicRoutes, { prefix: '/api/public' });

    // Start server
    await fastify.listen({
      port: env.API_PORT,
      host: env.API_HOST,
    });

    fastify.log.info(
      `🚀 Server running at http://${env.API_HOST}:${env.API_PORT}`
    );
    fastify.log.info(`📝 Environment: ${env.NODE_ENV}`);
    fastify.log.info(`📊 Health check: http://${env.API_HOST}:${env.API_PORT}/health`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
const signals = ['SIGINT', 'SIGTERM'];
signals.forEach((signal) => {
  process.on(signal, async () => {
    fastify.log.info(`Received ${signal}, closing server...`);
    await fastify.close();
    process.exit(0);
  });
});

start();
