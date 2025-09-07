import { z } from 'zod';

import {
  uuidSchema,
  organizationNameSchema,
  paginationSchema,
  isoDateStringSchema,
  roleSchema,
  emailSchema,
} from './base';

// Basic CRUD operations
export const createOrganizationSchema = z.object({
  name: organizationNameSchema,
});

export const updateOrganizationSchema = z.object({
  organizationId: uuidSchema,
  name: organizationNameSchema,
});

// Search and filtering
export const organizationSearchSchema = paginationSchema.extend({
  query: z.string().min(1).max(100).trim().optional(),
  sortBy: z.enum(['name', 'created_at', 'member_count']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Advanced filtering for admin dashboards
export const organizationFiltersSchema = z.object({
  query: z.string().min(1).max(100).trim().optional(),
  createdAfter: isoDateStringSchema.optional(),
  createdBefore: isoDateStringSchema.optional(),
  minMembers: z.number().int().min(0).optional(),
  maxMembers: z.number().int().min(0).optional(),
  hasMembers: z.boolean().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  sortBy: z.enum(['name', 'created_at', 'member_count']).default('name'),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Organization membership management
export const addMemberSchema = z.object({
  organizationId: uuidSchema,
  userId: uuidSchema,
  role: roleSchema.default('user'),
});

export const updateMemberRoleSchema = z.object({
  organizationId: uuidSchema,
  userId: uuidSchema,
  role: roleSchema,
});

export const removeMemberSchema = z.object({
  organizationId: uuidSchema,
  userId: uuidSchema,
});

// Bulk operations
export const bulkAddMembersSchema = z.object({
  organizationId: uuidSchema,
  members: z
    .array(
      z.object({
        userId: uuidSchema,
        role: roleSchema.default('user'),
      })
    )
    .min(1)
    .max(50),
});

export const bulkUpdateOrganizationsSchema = z.object({
  organizationIds: z.array(uuidSchema).min(1).max(20),
  updates: z.object({
    name: organizationNameSchema.optional(),
  }),
});

// Organization settings/configuration
export const organizationSettingsSchema = z.object({
  organizationId: uuidSchema,
  settings: z.object({
    allowSelfRegistration: z.boolean().default(false),
    defaultMemberRole: roleSchema.default('user'),
    maxMembers: z.number().int().min(1).max(10000).optional(),
  }),
});

// Route parameter validation
export const organizationParamsSchema = z.object({
  organizationId: uuidSchema,
});

// Organization statistics/analytics
export const organizationStatsSchema = z.object({
  organizationId: uuidSchema,
  dateFrom: isoDateStringSchema.optional(),
  dateTo: isoDateStringSchema.optional(),
  includeMembers: z.boolean().default(true),
  includeActivity: z.boolean().default(false),
});

// Organization invitation
export const inviteToOrganizationSchema = z.object({
  organizationId: uuidSchema,
  email: emailSchema,
  role: roleSchema.default('user'),
  message: z.string().max(500).trim().optional(),
});

// Join organization (via invitation code)
export const joinOrganizationSchema = z.object({
  invitationCode: z.string().min(10).max(100),
  userId: uuidSchema,
});
