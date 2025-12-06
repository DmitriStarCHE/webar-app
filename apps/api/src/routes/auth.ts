import { FastifyPluginAsync } from 'fastify';
import {
  registerSchema,
  loginSchema,
  refreshTokenSchema,
} from '../schemas/auth.schema.js';
import { authService } from '../services/auth.service.js';
import { authenticate } from '../middlewares/authenticate.js';

const authRoutes: FastifyPluginAsync = async (fastify) => {
  // Register
  fastify.post('/register', async (request, reply) => {
    const data = registerSchema.parse(request.body);

    const user = await authService.register(data);

    const accessToken = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = fastify.createRefreshToken({
      id: user.id,
    });

    return reply.status(201).send({
      user,
      accessToken,
      refreshToken,
    });
  });

  // Login
  fastify.post('/login', async (request, reply) => {
    const data = loginSchema.parse(request.body);

    const user = await authService.login(data);

    const accessToken = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = fastify.createRefreshToken({
      id: user.id,
    });

    return reply.send({
      user,
      accessToken,
      refreshToken,
    });
  });

  // Refresh token
  fastify.post('/refresh', async (request, reply) => {
    const { refreshToken } = refreshTokenSchema.parse(request.body);

    const decoded = await fastify.verifyRefreshToken(refreshToken);

    const user = await authService.getUserById(decoded.id);

    if (!user) {
      return reply.status(401).send({
        error: 'Unauthorized',
        message: 'User not found',
      });
    }

    const newAccessToken = fastify.jwt.sign({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = fastify.createRefreshToken({
      id: user.id,
    });

    return reply.send({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  // Get current user
  fastify.get(
    '/me',
    {
      onRequest: [authenticate],
    },
    async (request, reply) => {
      const user = await authService.getUserById(request.user.id);

      if (!user) {
        return reply.status(404).send({
          error: 'Not Found',
          message: 'User not found',
        });
      }

      return reply.send({ user });
    }
  );
};

export default authRoutes;
