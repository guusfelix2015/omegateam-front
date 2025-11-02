import { api } from '../lib/axios';
import { z } from 'zod';

// Enums - Using const objects instead of enums for erasableSyntaxOnly
export const Clan = {
  CLA1: 'CLA1',
  CLA2: 'CLA2',
} as const;

export const PlayerType = {
  PVP: 'PVP',
  PVE: 'PVE',
} as const;

export type Clan = typeof Clan[keyof typeof Clan];
export type PlayerType = typeof PlayerType[keyof typeof PlayerType];

// Overview Stats Schema
const AdminOverviewStatsSchema = z.object({
  users: z.object({
    total: z.number(),
    active: z.number(),
    inactive: z.number(),
    newLast7Days: z.number(),
    newLast30Days: z.number(),
  }),
  raids: z.object({
    total: z.number(),
    audited: z.number(),
    pendingAudit: z.number(),
    last7Days: z.number(),
    last30Days: z.number(),
  }),
  auctions: z.object({
    total: z.number(),
    active: z.number(),
    finished: z.number(),
    totalItemsSold: z.number(),
  }),
  dkp: z.object({
    totalInCirculation: z.number(),
    totalDistributed: z.number(),
    averagePerPlayer: z.number(),
  }),
});

// User Analytics Schema
const UserAnalyticsSchema = z.object({
  totalUsers: z.number(),
  levelDistribution: z.array(
    z.object({
      range: z.string(),
      count: z.number(),
    })
  ),
  classDistribution: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  playerTypeDistribution: z.array(
    z.object({
      type: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  clanDistribution: z.array(
    z.object({
      clan: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  roleDistribution: z.array(
    z.object({
      role: z.string(),
      count: z.number(),
      percentage: z.number(),
    })
  ),
  topPlayersByGearScore: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      nickname: z.string(),
      gearScore: z.number(),
      className: z.string().optional(),
    })
  ),
  topPlayersByDkp: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      nickname: z.string(),
      dkpPoints: z.number(),
      className: z.string().optional(),
    })
  ),
  averageGearScore: z.number(),
  averageDkp: z.number(),
  averageLevel: z.number(),
});

// Raid Analytics Schema
const RaidAnalyticsSchema = z.object({
  totalRaids: z.number(),
  auditedRaids: z.number(),
  pendingAuditRaids: z.number(),
  totalParticipants: z.number(),
  averageParticipantsPerRaid: z.number(),
  totalDkpDistributed: z.number(),
  averageDkpPerRaid: z.number(),
  attendanceConfirmationRate: z.number(),
  mostPopularRaids: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      instanceCount: z.number(),
      totalParticipants: z.number(),
    })
  ),
  raidTrends: z.array(
    z.object({
      date: z.string(),
      count: z.number(),
      participants: z.number(),
      dkpDistributed: z.number(),
    })
  ),
});

// DKP Analytics Schema
const DkpAnalyticsSchema = z.object({
  totalDkpInCirculation: z.number(),
  totalTransactions: z.number(),
  transactionsByType: z.array(
    z.object({
      type: z.string(),
      count: z.number(),
      totalAmount: z.number(),
    })
  ),
  dkpTrends: z.array(
    z.object({
      date: z.string(),
      totalAmount: z.number(),
      transactionCount: z.number(),
    })
  ),
  averageDkpPerPlayer: z.number(),
  topDkpHolders: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      nickname: z.string(),
      dkpPoints: z.number(),
      className: z.string().optional(),
    })
  ),
  dkpDistributionHistogram: z.array(
    z.object({
      range: z.string(),
      count: z.number(),
    })
  ),
});

// Company Party Stats Schema
const CompanyPartyStatsSchema = z.object({
  totalParties: z.number(),
  totalMembers: z.number(),
  averageMembersPerParty: z.number(),
  parties: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      memberCount: z.number(),
      averageDkp: z.number(),
      averageGearScore: z.number(),
    })
  ),
});

// Activity Feed Schema
const ActivityFeedItemSchema = z.object({
  id: z.string(),
  type: z.enum(['raid', 'auction', 'user', 'dkp']),
  title: z.string(),
  description: z.string(),
  createdAt: z.string().transform((val: string) => new Date(val)),
  metadata: z.record(z.string(), z.any()).optional(),
});

// Exported Types
export type AdminOverviewStats = z.infer<typeof AdminOverviewStatsSchema>;
export type UserAnalytics = z.infer<typeof UserAnalyticsSchema>;
export type RaidAnalytics = z.infer<typeof RaidAnalyticsSchema>;
export type DkpAnalytics = z.infer<typeof DkpAnalyticsSchema>;
export type CompanyPartyStats = z.infer<typeof CompanyPartyStatsSchema>;
export type ActivityFeedItem = z.infer<typeof ActivityFeedItemSchema>;

// Filter interfaces
export interface UserAnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  clan?: Clan;
  playerType?: PlayerType;
  classId?: string;
  levelMin?: number;
  levelMax?: number;
}

export interface RaidAnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  raidId?: string;
}

export interface DkpAnalyticsFilters {
  dateFrom?: string;
  dateTo?: string;
  userId?: string;
}

export const adminStatsService = {
  // Overview Statistics
  async getOverviewStats(): Promise<AdminOverviewStats> {
    const response = await api.get('/admin/stats/overview');
    return AdminOverviewStatsSchema.parse(response.data);
  },

  // User Analytics
  async getUserAnalytics(
    filters: UserAnalyticsFilters = {}
  ): Promise<UserAnalytics> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.clan) params.append('clan', filters.clan);
    if (filters.playerType) params.append('playerType', filters.playerType);
    if (filters.classId) params.append('classId', filters.classId);
    if (filters.levelMin !== undefined)
      params.append('levelMin', filters.levelMin.toString());
    if (filters.levelMax !== undefined)
      params.append('levelMax', filters.levelMax.toString());

    const response = await api.get(`/admin/stats/users?${params.toString()}`);
    return UserAnalyticsSchema.parse(response.data);
  },

  // Raid Analytics
  async getRaidAnalytics(
    filters: RaidAnalyticsFilters = {}
  ): Promise<RaidAnalytics> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.raidId) params.append('raidId', filters.raidId);

    const response = await api.get(`/admin/stats/raids?${params.toString()}`);
    return RaidAnalyticsSchema.parse(response.data);
  },

  // DKP Analytics
  async getDkpAnalytics(
    filters: DkpAnalyticsFilters = {}
  ): Promise<DkpAnalytics> {
    const params = new URLSearchParams();
    if (filters.dateFrom) params.append('dateFrom', filters.dateFrom);
    if (filters.dateTo) params.append('dateTo', filters.dateTo);
    if (filters.userId) params.append('userId', filters.userId);

    const response = await api.get(`/admin/stats/dkp?${params.toString()}`);
    return DkpAnalyticsSchema.parse(response.data);
  },

  // Company Party Statistics
  async getCompanyPartyStats(): Promise<CompanyPartyStats> {
    const response = await api.get('/admin/stats/company-parties');
    return CompanyPartyStatsSchema.parse(response.data);
  },

  // Activity Feed
  async getActivityFeed(limit?: number): Promise<ActivityFeedItem[]> {
    const params = new URLSearchParams();
    if (limit) params.append('limit', limit.toString());

    const response = await api.get(`/admin/stats/activity?${params.toString()}`);
    return z.array(ActivityFeedItemSchema).parse(response.data);
  },
};
