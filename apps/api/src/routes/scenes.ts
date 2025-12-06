import { FastifyPluginAsync } from 'fastify';
import {
  createSceneSchema,
  updateSceneSchema,
  sceneIdSchema,
} from '../schemas/scene.schema.js';
import { sceneService } from '../services/scene.service.js';
import { authenticate } from '../middlewares/authenticate.js';
import { z } from 'zod';

const scenesRoutes: FastifyPluginAsync = async (fastify) => {
  // All routes require authentication
  fastify.addHook('onRequest', authenticate);

  // Get scenes by project ID
  fastify.get('/project/:projectId', async (request, reply) => {
    const { projectId } = z
      .object({ projectId: z.string().uuid() })
      .parse(request.params);

    const scenes = await sceneService.getScenesByProject(
      projectId,
      request.user.id
    );
    return reply.send({ scenes });
  });

  // Get a specific scene
  fastify.get('/:id', async (request, reply) => {
    const { id } = sceneIdSchema.parse(request.params);
    const scene = await sceneService.getSceneById(id, request.user.id);
    return reply.send({ scene });
  });

  // Create a new scene
  fastify.post('/', async (request, reply) => {
    const data = createSceneSchema.parse(request.body);
    const scene = await sceneService.createScene(request.user.id, data);
    return reply.status(201).send({ scene });
  });

  // Update a scene
  fastify.put('/:id', async (request, reply) => {
    const { id } = sceneIdSchema.parse(request.params);
    const data = updateSceneSchema.parse(request.body);
    const scene = await sceneService.updateScene(id, request.user.id, data);
    return reply.send({ scene });
  });

  // Delete a scene
  fastify.delete('/:id', async (request, reply) => {
    const { id } = sceneIdSchema.parse(request.params);
    const result = await sceneService.deleteScene(id, request.user.id);
    return reply.send(result);
  });

  // Toggle scene active status
  fastify.post('/:id/toggle', async (request, reply) => {
    const { id } = sceneIdSchema.parse(request.params);
    const scene = await sceneService.toggleSceneActive(id, request.user.id);
    return reply.send({
      scene,
      message: `Scene ${scene.isActive ? 'activated' : 'deactivated'}`,
    });
  });
};

export default scenesRoutes;
