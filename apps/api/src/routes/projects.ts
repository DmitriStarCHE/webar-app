import { FastifyPluginAsync } from 'fastify';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
} from '../schemas/project.schema.js';
import { projectService } from '../services/project.service.js';
import { authenticate } from '../middlewares/authenticate.js';

const projectRoutes: FastifyPluginAsync = async (fastify) => {
  // All routes require authentication
  fastify.addHook('onRequest', authenticate);

  // Get all projects for current user
  fastify.get('/', async (request, reply) => {
    const projects = await projectService.getAllProjects(request.user.id);
    return reply.send({ projects });
  });

  // Get a specific project
  fastify.get('/:id', async (request, reply) => {
    const { id } = projectIdSchema.parse(request.params);
    const project = await projectService.getProjectById(id, request.user.id);
    return reply.send({ project });
  });

  // Create a new project
  fastify.post('/', async (request, reply) => {
    const data = createProjectSchema.parse(request.body);
    const project = await projectService.createProject(request.user.id, data);
    return reply.status(201).send({ project });
  });

  // Update a project
  fastify.put('/:id', async (request, reply) => {
    const { id } = projectIdSchema.parse(request.params);
    const data = updateProjectSchema.parse(request.body);
    const project = await projectService.updateProject(
      id,
      request.user.id,
      data
    );
    return reply.send({ project });
  });

  // Delete a project
  fastify.delete('/:id', async (request, reply) => {
    const { id } = projectIdSchema.parse(request.params);
    const result = await projectService.deleteProject(id, request.user.id);
    return reply.send(result);
  });

  // Get project statistics
  fastify.get('/:id/stats', async (request, reply) => {
    const { id } = projectIdSchema.parse(request.params);
    const stats = await projectService.getProjectStats(id, request.user.id);
    return reply.send({ stats });
  });
};

export default projectRoutes;
