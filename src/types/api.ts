import { z } from 'zod';

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['ADMIN', 'PLAYER']),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
  lvl: z.number(),
  nickname: z.string(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  message: z.string(),
});

// Company Party schemas
export const CompanyPartySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  leaderId: z.string(),
  maxMembers: z.number(),
  currentMembers: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
  leader: UserSchema.optional(),
  members: z.array(UserSchema).optional(),
});

export const CreateCompanyPartySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  maxMembers: z.number().min(1, 'Máximo de membros deve ser pelo menos 1').max(100, 'Máximo de 100 membros'),
});

export const UpdateCompanyPartySchema = CreateCompanyPartySchema.partial();

export const AddPlayerToPartySchema = z.object({
  playerId: z.string(),
});

// API Response wrapper
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema,
    message: z.string().optional(),
  });

export const ApiErrorSchema = z.object({
  success: z.literal(false),
  error: z.string(),
  message: z.string().optional(),
});

// Type exports
export type User = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type CompanyParty = z.infer<typeof CompanyPartySchema>;
export type CreateCompanyParty = z.infer<typeof CreateCompanyPartySchema>;
export type UpdateCompanyParty = z.infer<typeof UpdateCompanyPartySchema>;
export type AddPlayerToParty = z.infer<typeof AddPlayerToPartySchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
