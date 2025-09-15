import { z } from 'zod';

// Classe schemas (defined first to be used in UserSchema)
export const ClasseSchema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.string(),
});

export const ClassesListSchema = z.object({
  data: z.array(ClasseSchema),
});

// Company Party relation schema (for user's perspective)
export const UserCompanyPartyRelationSchema = z.object({
  id: z.string(),
  companyPartyId: z.string(),
  joinedAt: z.string(),
  companyParty: z.object({
    id: z.string(),
    name: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  }),
});

// User schemas
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  role: z.enum(['ADMIN', 'PLAYER', 'CP_LEADER']),
  createdAt: z.string(),
  updatedAt: z.string(),
  isActive: z.boolean(),
  lvl: z.number(),
  nickname: z.string(),
  avatar: z.string().nullable().optional(),
  classeId: z.string().nullable().optional(),
  classe: ClasseSchema.nullable().optional(),
  companyParties: z.array(UserCompanyPartyRelationSchema).optional(),
});

export const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const LoginResponseSchema = z.object({
  token: z.string(),
  message: z.string(),
});

// User Company Party relation schema
export const UserCompanyPartySchema = z.object({
  id: z.string(),
  userId: z.string(),
  joinedAt: z.string(),
  user: z.object({
    id: z.string(),
    email: z.string(),
    name: z.string(),
    nickname: z.string(),
    avatar: z.string().nullable().optional(),
    lvl: z.number(),
    role: z.enum(['ADMIN', 'PLAYER']),
  }),
});

// Company Party schemas
export const CompanyPartySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  leaderId: z.string().optional(),
  maxMembers: z.number().optional(),
  playerCount: z.number().optional(),
  currentMembers: z.number().optional(), // Keep for backward compatibility
  isActive: z.boolean().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
  leader: UserSchema.optional(),
  members: z.array(UserSchema).optional(),
  users: z.array(UserSchema).optional(), // Flattened user objects for detailed view
});

export const CreateCompanyPartySchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  maxMembers: z.number().min(1, 'Máximo de membros deve ser pelo menos 1').max(100, 'Máximo de 100 membros'),
});

export const UpdateCompanyPartySchema = CreateCompanyPartySchema.partial();

export const AddPlayerToPartySchema = z.object({
  userId: z.string(),
});

export const CreateUserSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
  name: z.string().min(1, 'Nome é obrigatório'),
  nickname: z.string().min(1, 'Nickname é obrigatório'),
  role: z.enum(['ADMIN', 'PLAYER', 'CP_LEADER']).default('PLAYER'),
  companyPartyId: z.string().optional(),
  classeId: z.string().optional(),
});

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

export type User = z.infer<typeof UserSchema>;
export type LoginRequest = z.infer<typeof LoginRequestSchema>;
export type LoginResponse = z.infer<typeof LoginResponseSchema>;
export type CompanyParty = z.infer<typeof CompanyPartySchema>;
export type CreateCompanyParty = z.infer<typeof CreateCompanyPartySchema>;
export type UpdateCompanyParty = z.infer<typeof UpdateCompanyPartySchema>;
export type AddPlayerToParty = z.infer<typeof AddPlayerToPartySchema>;
export type ApiError = z.infer<typeof ApiErrorSchema>;
export type Classe = z.infer<typeof ClasseSchema>;
export type ClassesList = z.infer<typeof ClassesListSchema>;
export type CreateUser = z.infer<typeof CreateUserSchema>;

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
