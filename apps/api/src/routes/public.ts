import { FastifyPluginAsync } from 'fastify';
import { z } from 'zod';
import { sceneIdSchema } from '../schemas/scene.schema.js';
import { sceneService } from '../services/scene.service.js';

const publicRoutes: FastifyPluginAsync = async (fastify) => {
  // Get scene data for AR Viewer (no authentication required)
  fastify.get('/scenes/:id', async (request, reply) => {
    const { id } = sceneIdSchema.parse(request.params);
    const scene = await sceneService.getPublicScene(id);

    return reply.send({
      scene: {
        id: scene.id,
        name: scene.name,
        triggerImageUrl: scene.triggerImageUrl,
        triggerMindFile: scene.triggerMindFile,
        content: scene.content,
        viewCount: scene.viewCount,
      },
    });
  });

  // AR Viewer URL endpoint
  fastify.get('/viewer/:sceneId', async (request, reply) => {
    const { sceneId } = z
      .object({ sceneId: z.string().uuid() })
      .parse(request.params);

    const scene = await sceneService.getPublicScene(sceneId);

    // Return viewer URL
    const viewerUrl = `${process.env.VIEWER_URL}?scene=${sceneId}`;

    return reply.send({
      viewerUrl,
      scene: {
        id: scene.id,
        name: scene.name,
      },
    });
  });
};

export default publicRoutes;
