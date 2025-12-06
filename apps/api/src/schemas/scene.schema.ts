import { z } from 'zod';

export const createSceneSchema = z.object({
  projectId: z.string().uuid('Invalid project ID'),
  name: z.string().min(1, 'Scene name is required').max(100),
});

export const updateSceneSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  isActive: z.boolean().optional(),
  triggerImageUrl: z.string().url().optional().nullable(),
  triggerImageKey: z.string().optional().nullable(),
  triggerCompiled: z.boolean().optional(),
  triggerMindFile: z.string().url().optional().nullable(),
});

export const sceneIdSchema = z.object({
  id: z.string().uuid('Invalid scene ID'),
});

export const uploadTriggerSchema = z.object({
  sceneId: z.string().uuid('Invalid scene ID'),
});

export type CreateSceneInput = z.infer<typeof createSceneSchema>;
export type UpdateSceneInput = z.infer<typeof updateSceneSchema>;
export type SceneIdInput = z.infer<typeof sceneIdSchema>;
export type UploadTriggerInput = z.infer<typeof uploadTriggerSchema>;
