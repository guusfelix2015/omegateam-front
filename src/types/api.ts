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
  playerType: z.enum(['PVP', 'PVE']).nullable().optional(),
  clan: z.enum(['CLA1', 'CLA2']).nullable().optional(),
  ownedItemIds: z.array(z.string()).default([]),
  gearScore: z.number().default(0),
  dkpPoints: z.number().default(0),
  bagUrl: z.string().nullable().optional(),
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
  description: z.string().nullable().optional(),
  leaderId: z.string().nullable().optional(),
  maxMembers: z.number().nullable().optional(),
  playerCount: z.number().optional(),
  averageLevel: z.number().optional(),
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
  maxMembers: z
    .number()
    .min(1, 'Máximo de membros deve ser pelo menos 1')
    .max(100, 'Máximo de 100 membros'),
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

export const UpdateProfileSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório').optional(),
  nickname: z.string().min(1, 'Nickname é obrigatório').optional(),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .optional(),
  avatar: z.string().url('URL inválida').nullable().optional(),
  lvl: z.number().min(1).max(85).optional(),
  classeId: z.string().nullable().optional(),
  playerType: z.enum(['PVP', 'PVE']).nullable().optional(),
  clan: z.enum(['CLA1', 'CLA2']).nullable().optional(),
  bagUrl: z.string().url('URL inválida').nullable().optional(),
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
export type UpdateProfile = z.infer<typeof UpdateProfileSchema>;

// Item schemas
export const ItemCategorySchema = z.enum([
  'HELMET',
  'ARMOR',
  'PANTS',
  'BOOTS',
  'GLOVES',
  'NECKLACE',
  'EARRING',
  'RING',
  'SHIELD',
  'WEAPON',
  'COMUM',
]);

export const ItemGradeSchema = z.enum(['D', 'C', 'B', 'A', 'S']);

export const ItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: ItemCategorySchema,
  grade: ItemGradeSchema,
  valorGsInt: z.number(),
  valorDkp: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: ItemCategorySchema,
  grade: ItemGradeSchema,
  valorGsInt: z.number().min(0, 'Valor GS INT deve ser positivo'),
  valorDkp: z.number().min(0, 'Valor DKP deve ser positivo'),
});

export const UpdateItemSchema = CreateItemSchema.partial();

export const ItemsListSchema = z.object({
  data: z.array(ItemSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export const ItemStatsSchema = z.object({
  total: z.number(),
  byCategory: z.record(z.string(), z.number()),
  byGrade: z.record(z.string(), z.number()),
});

export const LookupsSchema = z.object({
  categories: z.array(z.string()),
  grades: z.array(z.string()),
});

export type Item = z.infer<typeof ItemSchema>;
export type ItemCategory = z.infer<typeof ItemCategorySchema>;
export type ItemGrade = z.infer<typeof ItemGradeSchema>;
export type CreateItem = z.infer<typeof CreateItemSchema>;
export type UpdateItem = z.infer<typeof UpdateItemSchema>;
export type ItemsList = z.infer<typeof ItemsListSchema>;
export type ItemStats = z.infer<typeof ItemStatsSchema>;
export type Lookups = z.infer<typeof LookupsSchema>;

// UserItem schemas
export const UserItemSchema = z.object({
  id: z.string(),
  itemId: z.string(),
  enhancementLevel: z.number().min(0).max(12),
  item: ItemSchema,
});

// Gear Score schemas
export const UpdateUserGearSchema = z.object({
  items: z.array(
    z.object({
      itemId: z.string(),
      enhancementLevel: z.number().min(0).max(12).default(0),
    })
  ),
});

export const UserGearResponseSchema = z.object({
  gearScore: z.number(),
  userItems: z.array(UserItemSchema),
});

export const UpdateItemEnhancementSchema = z.object({
  userItemId: z.string(),
  enhancementLevel: z.number().min(0).max(12),
});

export type UserItem = z.infer<typeof UserItemSchema>;
export type UpdateUserGear = z.infer<typeof UpdateUserGearSchema>;
export type UserGearResponse = z.infer<typeof UserGearResponseSchema>;
export type UpdateItemEnhancement = z.infer<typeof UpdateItemEnhancementSchema>;

// DKP schemas
export const DkpTransactionTypeSchema = z.enum([
  'RAID_REWARD',
  'MANUAL_ADJUSTMENT',
  'ITEM_PURCHASE',
]);

export const RaidSchema = z.object({
  id: z.string(),
  name: z.string(),
  bossLevel: z.number(),
  baseScore: z.number(),
  isActive: z.boolean(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export const CreateRaidSchema = z.object({
  name: z.string(),
  bossLevel: z.number(),
  baseScore: z.number(),
});

export const UpdateRaidSchema = z.object({
  name: z.string().optional(),
  bossLevel: z.number().optional(),
  baseScore: z.number().optional(),
  isActive: z.boolean().optional(),
});

export const RaidParticipantSchema = z.object({
  id: z.string(),
  raidInstanceId: z.string(),
  userId: z.string(),
  gearScoreAtTime: z.number(),
  dkpAwarded: z.number(),
  createdAt: z.string(),
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      nickname: z.string(),
      avatar: z.string().nullable(),
    })
    .optional(),
});

export const RaidInstanceSchema = z.object({
  id: z.string(),
  raidId: z.string(),
  completedAt: z.string(),
  createdBy: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  raid: RaidSchema,
  participants: z.array(RaidParticipantSchema),
});

export const CreateRaidInstanceSchema = z.object({
  raidId: z.string(),
  participantIds: z.array(z.string()),
  notes: z.string().optional(),
});

export const CreateRaidInstanceDroppedItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: ItemCategorySchema,
  grade: ItemGradeSchema,
  minDkpBid: z.number().min(0, 'Lance mínimo deve ser não-negativo'),
  notes: z.string().optional(),
});

export const CreateRaidInstanceWithItemsSchema = z.object({
  raidId: z.string(),
  participantIds: z.array(z.string()),
  notes: z.string().optional(),
  droppedItems: z.array(CreateRaidInstanceDroppedItemSchema).optional(),
});

export const AddParticipantSchema = z.object({
  userId: z.string(),
});

export const DkpTransactionSchema = z.object({
  id: z.string(),
  userId: z.string(),
  type: DkpTransactionTypeSchema,
  amount: z.number(),
  reason: z.string(),
  createdBy: z.string(),
  raidInstanceId: z.string().nullable(),
  createdAt: z.string(),
  user: z
    .object({
      id: z.string(),
      name: z.string(),
      nickname: z.string(),
      avatar: z.string().nullable(),
    })
    .optional(),
  createdByUser: z
    .object({
      id: z.string(),
      name: z.string(),
      nickname: z.string(),
    })
    .optional(),
  raidInstance: z
    .object({
      id: z.string(),
      completedAt: z.string(),
      raid: z.object({
        id: z.string(),
        name: z.string(),
        bossLevel: z.number(),
      }),
    })
    .nullable()
    .optional(),
});

export const DkpAdjustmentSchema = z.object({
  userId: z.string(),
  amount: z.number(),
  reason: z.string(),
});

export const DkpLeaderboardEntrySchema = z.object({
  id: z.string(),
  name: z.string(),
  nickname: z.string(),
  avatar: z.string().nullable(),
  dkpPoints: z.number(),
  gearScore: z.number(),
  lvl: z.number(),
  classe: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .nullable(),
});

export const UserDkpSummarySchema = z.object({
  userId: z.string(),
  currentDkpPoints: z.number(),
  totalEarned: z.number(),
  totalSpent: z.number(),
  totalRaidRewards: z.number(),
  totalManualAdjustments: z.number(),
  raidParticipations: z.number(),
  lastActivity: z.string().nullable(),
});

export const DkpStatsSchema = z.object({
  totalTransactions: z.number(),
  totalDkpAwarded: z.number(),
  totalDkpSpent: z.number(),
  totalManualAdjustments: z.number(),
  averageDkpPerUser: z.number(),
  topDkpHolder: z
    .object({
      id: z.string(),
      name: z.string(),
      nickname: z.string(),
      dkpPoints: z.number(),
    })
    .nullable(),
});

// DKP type exports
export type DkpTransactionType = z.infer<typeof DkpTransactionTypeSchema>;
export type Raid = z.infer<typeof RaidSchema>;
export type CreateRaid = z.infer<typeof CreateRaidSchema>;
export type UpdateRaid = z.infer<typeof UpdateRaidSchema>;
export type RaidParticipant = z.infer<typeof RaidParticipantSchema>;
export type RaidInstance = z.infer<typeof RaidInstanceSchema>;
export type CreateRaidInstance = z.infer<typeof CreateRaidInstanceSchema>;
export type CreateRaidInstanceDroppedItem = z.infer<
  typeof CreateRaidInstanceDroppedItemSchema
>;
export type CreateRaidInstanceWithItems = z.infer<
  typeof CreateRaidInstanceWithItemsSchema
>;
export type AddParticipant = z.infer<typeof AddParticipantSchema>;
export type DkpTransaction = z.infer<typeof DkpTransactionSchema>;
export type DkpAdjustment = z.infer<typeof DkpAdjustmentSchema>;
export type DkpLeaderboardEntry = z.infer<typeof DkpLeaderboardEntrySchema>;
export type UserDkpSummary = z.infer<typeof UserDkpSummarySchema>;
export type DkpStats = z.infer<typeof DkpStatsSchema>;

// Raid Dropped Item schemas
export const RaidDroppedItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: ItemCategorySchema,
  grade: ItemGradeSchema,
  minDkpBid: z.number(),
  hasBeenAuctioned: z.boolean(),
  raidInstanceId: z.string(),
  droppedAt: z.string(),
  createdBy: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  raidInstance: z
    .object({
      id: z.string(),
      completedAt: z.string(),
      raid: z.object({
        id: z.string(),
        name: z.string(),
        bossLevel: z.number(),
      }),
    })
    .optional(),
  auctionItems: z
    .array(
      z.object({
        id: z.string(),
        status: z.enum([
          'WAITING',
          'IN_AUCTION',
          'SOLD',
          'NO_BIDS',
          'CANCELLED',
        ]),
        currentBid: z.number().nullable(),
        finishedAt: z.string().nullable(),
        auction: z.object({
          id: z.string(),
          createdAt: z.string(),
        }),
        currentWinner: z
          .object({
            id: z.string(),
            name: z.string(),
            nickname: z.string(),
          })
          .nullable(),
      })
    )
    .optional(),
});

export const CreateRaidDroppedItemSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  category: ItemCategorySchema,
  grade: ItemGradeSchema,
  minDkpBid: z.number().min(0, 'Lance mínimo deve ser não-negativo'),
  notes: z.string().optional(),
});

export const UpdateRaidDroppedItemSchema =
  CreateRaidDroppedItemSchema.partial();

export const RaidDroppedItemsListSchema = z.object({
  data: z.array(RaidDroppedItemSchema),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
    totalPages: z.number(),
    hasNext: z.boolean(),
    hasPrev: z.boolean(),
  }),
});

export const RaidDroppedItemStatsSchema = z.object({
  total: z.number(),
  totalByCategory: z.record(z.string(), z.number()),
  totalByGrade: z.record(z.string(), z.number()),
  averageMinDkpBid: z.number(),
});

export type RaidDroppedItem = z.infer<typeof RaidDroppedItemSchema>;
export type CreateRaidDroppedItem = z.infer<typeof CreateRaidDroppedItemSchema>;
export type UpdateRaidDroppedItem = z.infer<typeof UpdateRaidDroppedItemSchema>;
export type RaidDroppedItemsList = z.infer<typeof RaidDroppedItemsListSchema>;
export type RaidDroppedItemStats = z.infer<typeof RaidDroppedItemStatsSchema>;

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  message?: string;
};
