import { prisma } from './prisma.service.js';
import { CreateSceneInput, UpdateSceneInput } from '../schemas/scene.schema.js';

export class SceneService {
  // Verify user owns the project
  private async verifyProjectOwnership(projectId: string, userId: string) {
    const project = await prisma.project.findFirst({
      where: {
        id: projectId,
        userId,
      },
    });

    if (!project) {
      throw new Error('Project not found or access denied');
    }

    return project;
  }

  // Verify user owns the scene (through project)
  private async verifySceneOwnership(sceneId: string, userId: string) {
    const scene = await prisma.aRScene.findFirst({
      where: { id: sceneId },
      include: { project: true },
    });

    if (!scene || scene.project.userId !== userId) {
      throw new Error('Scene not found or access denied');
    }

    return scene;
  }

  // Get all scenes for a project
  async getScenesByProject(projectId: string, userId: string) {
    await this.verifyProjectOwnership(projectId, userId);

    return prisma.aRScene.findMany({
      where: { projectId },
      include: {
        content: {
          select: {
            id: true,
            contentType: true,
            fileName: true,
            fileSize: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get a single scene by ID
  async getSceneById(sceneId: string, userId: string) {
    const scene = await this.verifySceneOwnership(sceneId, userId);

    return prisma.aRScene.findUnique({
      where: { id: sceneId },
      include: {
        content: true,
        project: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  // Create a new scene
  async createScene(userId: string, data: CreateSceneInput) {
    await this.verifyProjectOwnership(data.projectId, userId);

    return prisma.aRScene.create({
      data: {
        name: data.name,
        projectId: data.projectId,
      },
      include: {
        content: true,
      },
    });
  }

  // Update a scene
  async updateScene(sceneId: string, userId: string, data: UpdateSceneInput) {
    await this.verifySceneOwnership(sceneId, userId);

    return prisma.aRScene.update({
      where: { id: sceneId },
      data,
      include: {
        content: true,
      },
    });
  }

  // Delete a scene
  async deleteScene(sceneId: string, userId: string) {
    await this.verifySceneOwnership(sceneId, userId);

    // Cascade delete will handle content
    await prisma.aRScene.delete({
      where: { id: sceneId },
    });

    return { success: true, message: 'Scene deleted successfully' };
  }

  // Toggle scene active status
  async toggleSceneActive(sceneId: string, userId: string) {
    const scene = await this.verifySceneOwnership(sceneId, userId);

    return prisma.aRScene.update({
      where: { id: sceneId },
      data: { isActive: !scene.isActive },
    });
  }

  // Increment view count
  async incrementViewCount(sceneId: string) {
    return prisma.aRScene.update({
      where: { id: sceneId },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    });
  }

  // Get scene for public viewing (no auth required)
  async getPublicScene(sceneId: string) {
    const scene = await prisma.aRScene.findUnique({
      where: {
        id: sceneId,
        isActive: true,
      },
      include: {
        content: {
          select: {
            id: true,
            contentType: true,
            fileUrl: true,
            textContent: true,
            positionX: true,
            positionY: true,
            positionZ: true,
            rotationX: true,
            rotationY: true,
            rotationZ: true,
            scale: true,
            config: true,
          },
        },
      },
    });

    if (!scene) {
      throw new Error('Scene not found or inactive');
    }

    // Increment view count
    await this.incrementViewCount(sceneId);

    return scene;
  }
}

export const sceneService = new SceneService();
