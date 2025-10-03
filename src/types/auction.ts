import { z } from 'zod';

// Enums
export const auctionStatusSchema = z.enum(['PENDING', 'ACTIVE', 'FINISHED', 'CANCELLED']);
export const auctionItemStatusSchema = z.enum([
  'WAITING',
  'IN_AUCTION',
  'SOLD',
  'NO_BIDS',
  'CANCELLED',
]);
export const bidStatusSchema = z.enum(['ACTIVE', 'OUTBID', 'WON', 'CANCELLED']);

export const itemCategorySchema = z.enum([
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

export const itemGradeSchema = z.enum(['D', 'C', 'B', 'A', 'S']);

// User schema
export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  nickname: z.string(),
  avatar: z.string().nullable(),
});

// Raid schema
export const raidSchema = z.object({
  id: z.string(),
  name: z.string(),
});

// Raid instance schema
export const raidInstanceSchema = z.object({
  id: z.string(),
  completedAt: z.string(),
  raid: raidSchema,
});

// Raid dropped item schema
export const raidDroppedItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: itemCategorySchema,
  grade: itemGradeSchema,
  minDkpBid: z.number(),
  raidInstance: raidInstanceSchema,
});

// Bid schema
export const bidSchema = z.object({
  id: z.string(),
  auctionItemId: z.string(),
  userId: z.string(),
  amount: z.number(),
  status: bidStatusSchema,
  createdAt: z.string(),
  user: userSchema,
});

// Auction item schema
export const auctionItemSchema = z.object({
  id: z.string(),
  auctionId: z.string(),
  raidDroppedItemId: z.string(),
  status: auctionItemStatusSchema,
  minBid: z.number(),
  currentBid: z.number().nullable(),
  currentWinnerId: z.string().nullable(),
  timeRemaining: z.number().nullable(),
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  currentWinner: userSchema.nullable(),
  bids: z.array(bidSchema),
  raidDroppedItem: raidDroppedItemSchema,
});

// Auction schema
export const auctionSchema = z.object({
  id: z.string(),
  status: auctionStatusSchema,
  defaultTimerSeconds: z.number(),
  minBidIncrement: z.number(),
  createdBy: z.string(),
  startedAt: z.string().nullable(),
  finishedAt: z.string().nullable(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  creator: userSchema,
  items: z.array(auctionItemSchema),
  serverTime: z.string().optional(), // Server timestamp for sync
});

// Pagination schema
export const paginationSchema = z.object({
  page: z.number(),
  limit: z.number(),
  total: z.number(),
  totalPages: z.number(),
  hasNext: z.boolean(),
  hasPrev: z.boolean(),
});

// Auctions list response schema
export const auctionsListResponseSchema = z.object({
  data: z.array(auctionSchema),
  pagination: paginationSchema,
});

// User won item schema
export const userWonItemSchema = z.object({
  id: z.string(),
  itemName: z.string(),
  category: itemCategorySchema,
  grade: itemGradeSchema,
  amountPaid: z.number(),
  wonAt: z.string(),
  auctionId: z.string(),
  raidName: z.string(),
  raidCompletedAt: z.string(),
});

// Create auction input schema
export const createAuctionInputSchema = z.object({
  itemIds: z.array(z.string()).min(1, 'At least one item must be selected'),
  defaultTimerSeconds: z.number().int().min(10).max(300).optional(),
  minBidIncrement: z.number().int().min(1).optional(),
  notes: z.string().optional(),
});

// Create bid input schema
export const createBidInputSchema = z.object({
  auctionItemId: z.string(),
  amount: z.number().int().min(1),
});

// Get auctions query schema
export const getAuctionsQuerySchema = z.object({
  page: z.number().int().min(1).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  status: auctionStatusSchema.optional(),
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  itemName: z.string().optional(),
  itemCategory: itemCategorySchema.optional(),
  itemGrade: itemGradeSchema.optional(),
  sortBy: z.enum(['createdAt', 'startedAt', 'finishedAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
});

// Type exports
export type AuctionStatus = z.infer<typeof auctionStatusSchema>;
export type AuctionItemStatus = z.infer<typeof auctionItemStatusSchema>;
export type BidStatus = z.infer<typeof bidStatusSchema>;
export type ItemCategory = z.infer<typeof itemCategorySchema>;
export type ItemGrade = z.infer<typeof itemGradeSchema>;
export type User = z.infer<typeof userSchema>;
export type Raid = z.infer<typeof raidSchema>;
export type RaidInstance = z.infer<typeof raidInstanceSchema>;
export type RaidDroppedItem = z.infer<typeof raidDroppedItemSchema>;
export type Bid = z.infer<typeof bidSchema>;
export type AuctionItem = z.infer<typeof auctionItemSchema>;
export type Auction = z.infer<typeof auctionSchema>;
export type Pagination = z.infer<typeof paginationSchema>;
export type AuctionsListResponse = z.infer<typeof auctionsListResponseSchema>;
export type UserWonItem = z.infer<typeof userWonItemSchema>;
export type CreateAuctionInput = z.infer<typeof createAuctionInputSchema>;
export type CreateBidInput = z.infer<typeof createBidInputSchema>;
export type GetAuctionsQuery = z.infer<typeof getAuctionsQuerySchema>;

// Auctioned item schema
export const auctionedItemSchema = z.object({
  id: z.string(),
  name: z.string(),
  category: itemCategorySchema,
  grade: itemGradeSchema,
  minDkpBid: z.number(),
  hasBeenAuctioned: z.boolean(),
  raidInstanceId: z.string(),
  droppedAt: z.string(),
  createdBy: z.string(),
  notes: z.string().nullable(),
  createdAt: z.string(),
  updatedAt: z.string(),
  raidInstance: z.object({
    id: z.string(),
    completedAt: z.string(),
    raid: z.object({
      id: z.string(),
      name: z.string(),
    }),
  }),
  auctionItems: z.array(
    z.object({
      id: z.string(),
      status: auctionItemStatusSchema,
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
  ),
});

// Reset auctioned flag input schema
export const resetAuctionedFlagInputSchema = z.object({
  itemId: z.string(),
  reason: z.string().optional(),
});

// Audit log schema
export const auditLogSchema = z.object({
  id: z.string(),
  action: z.string(),
  entityType: z.string(),
  entityId: z.string(),
  performedBy: z.string(),
  reason: z.string().nullable(),
  previousValue: z.string().nullable(),
  newValue: z.string().nullable(),
  createdAt: z.string(),
});

export type AuctionedItem = z.infer<typeof auctionedItemSchema>;
export type ResetAuctionedFlagInput = z.infer<typeof resetAuctionedFlagInputSchema>;
export type AuditLog = z.infer<typeof auditLogSchema>;

// Won items query schema
export const wonItemsQuerySchema = z.object({
  dateFrom: z.string().optional(),
  dateTo: z.string().optional(),
  itemCategory: itemCategorySchema.optional(),
  itemGrade: itemGradeSchema.optional(),
});

export type WonItemsQuery = z.infer<typeof wonItemsQuerySchema>;

// Auction analytics schemas
export const itemPopularitySchema = z.object({
  itemName: z.string(),
  category: z.string(),
  grade: z.string(),
  totalBids: z.number(),
  totalAuctions: z.number(),
  averagePrice: z.number(),
  highestPrice: z.number(),
});

export const topSpenderSchema = z.object({
  userId: z.string(),
  userName: z.string(),
  userNickname: z.string(),
  totalSpent: z.number(),
  itemsWon: z.number(),
  averageSpent: z.number(),
});

export const categoryDistributionSchema = z.object({
  category: z.string(),
  count: z.number(),
  totalDkp: z.number(),
  averageDkp: z.number(),
});

export const gradeDistributionSchema = z.object({
  grade: z.string(),
  count: z.number(),
  totalDkp: z.number(),
  averageDkp: z.number(),
});

export const auctionTrendSchema = z.object({
  date: z.string(),
  auctionsCount: z.number(),
  itemsSold: z.number(),
  totalDkp: z.number(),
});

export const auctionAnalyticsSchema = z.object({
  totalAuctions: z.number(),
  totalItemsSold: z.number(),
  totalItemsNoBids: z.number(),
  totalDkpSpent: z.number(),
  averageDkpPerItem: z.number(),
  averageBidsPerItem: z.number(),
  mostPopularItems: z.array(itemPopularitySchema),
  topSpenders: z.array(topSpenderSchema),
  categoryDistribution: z.array(categoryDistributionSchema),
  gradeDistribution: z.array(gradeDistributionSchema),
  auctionTrends: z.array(auctionTrendSchema),
});

export type ItemPopularity = z.infer<typeof itemPopularitySchema>;
export type TopSpender = z.infer<typeof topSpenderSchema>;
export type CategoryDistribution = z.infer<typeof categoryDistributionSchema>;
export type GradeDistribution = z.infer<typeof gradeDistributionSchema>;
export type AuctionTrend = z.infer<typeof auctionTrendSchema>;
export type AuctionAnalytics = z.infer<typeof auctionAnalyticsSchema>;

