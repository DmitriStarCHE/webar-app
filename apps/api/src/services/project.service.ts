import { prisma } from './prisma.service.js';
import { CreateProjectInput, UpdateProjectInput } from '../schemas/project.schema.js';

export class ProjectService {
  // Get all projects for a user
  async getAllProjects(userId: string) {
    return prisma.project.findMany({
      where: { userId },
      include: {
        scenes: {
          select: {
            id: true,
            name: true,
            isActive: true,
            viewCount: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single project by ID
  async getProjectById(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
      include: {
        scenes: {
          include: {
            content: {
              select: {
                id: true,
                contentType: true,
                fileName: true,
                createdAt: true,
              },
            },
          },
        },
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return project;
  }

  // Create a new project
  async createProject(userId: string, data: CreateProjectInput) {
    return prisma.project.create({
      data: {
        ...data,
        userId,
      },
      include: {
        scenes: true,
      },
    });
  }

  // Update a project
  async updateProject(
    projectId: string,
    userId: string,
    data: UpdateProjectInput
  ) {
    // Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    return prisma.project.update({
      where: { id: projectId },
      data,
      include: {
        scenes: true,
      },
    });
  }

  // Delete a project
  async deleteProject(projectId: string, userId: string) {
    // Check if project exists and belongs to user
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error('Project not found');
    }

    // Cascade delete will handle scenes and content
    await prisma.project.delete({
      where: { id: projectId },
    });

    return { success: true, message: 'Project deleted successfully' };
  }

  // Get project statistics
  async getProjectStats(projectId: string, userId: string) {
    const project = await this.getProjectById(projectId, userId);

    const totalScenes = project.scenes.length;
    const activeScenes = project.scenes.filter((s) => s.isActive).length;
    const totalViews = project.scenes.reduce((sum, s) => sum + s.viewCount, 0);
    const totalContent = project.scenes.reduce(
      (sum, s) => sum + s.content.length,
      0
    );

    return {
      projectId: project.id,
      projectName: project.name,
      totalScenes,
      activeScenes,
      totalViews,
      totalContent,
      createdAt: project.createdAt,
    };
  }
}

export const projectService = new ProjectService();
