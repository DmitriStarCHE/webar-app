import { FastifyPluginAsync } from 'fastify';
import fp from 'fastify-plugin';
import jwt from '@fastify/jwt';
import { env } from '../config/env.js';

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
  // Register JWT plugin
  await fastify.register(jwt, {
    secret: env.JWT_SECRET,
    sign: {
      expiresIn: env.JWT_ACCESS_EXPIRATION,
    },
  });

  // Decorator for creating refresh tokens
  fastify.decorate('createRefreshToken', (payload: any) => {
    return fastify.jwt.sign(payload, {
      secret: env.JWT_REFRESH_SECRET,
      expiresIn: env.JWT_REFRESH_EXPIRATION,
    });
  });

  // Decorator for verifying refresh tokens
  fastify.decorate('verifyRefreshToken', async (token: string) => {
    return fastify.jwt.verify(token, {
      secret: env.JWT_REFRESH_SECRET,
    });
  });
};

declare module 'fastify' {
  interface FastifyInstance {
    createRefreshToken: (payload: any) => string;
    verifyRefreshToken: (token: string) => Promise<any>;
  }
}

export default fp(jwtPlugin, {
  name: 'jwt',
  dependencies: ['prisma'],
});
