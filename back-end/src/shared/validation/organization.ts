import { z } from 'zod';

import {
  uuidSchema,
  organizationNameSchema,
  paginationSchema,
  roleSchema,
  emailSchema,
} from './base';
import {
  createSearchQuerySchema,
  createSortingSchema,
  createDateRangeSchema,
  createBulkOperationSchema,
  createArraySchema,
} from './utils';

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
  query: createSearchQuerySchema(),
  ...createSortingSchema(
    ['name', 'created_at', 'member_count'] as const,
    'name'
  ).shape,
});

// Advanced filtering for admin dashboards
export const organizationFiltersSchema = paginationSchema.extend({
  query: createSearchQuerySchema(),
  minMembers: z.number().int().min(0).optional(),
  maxMembers: z.number().int().min(0).optional(),
  hasMembers: z.boolean().optional(),
  ...createSortingSchema(
    ['name', 'created_at', 'member_count'] as const,
    'name'
  ).shape,
  ...createDateRangeSchema().shape,
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
  members: createArraySchema(
    z.object({
      userId: uuidSchema,
      role: roleSchema.default('user'),
    }),
    1,
    50
  ),
});

export const bulkUpdateOrganizationsSchema = createBulkOperationSchema(
  z.object({
    name: organizationNameSchema.optional(),
  }),
  20
);

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
  includeMembers: z.boolean().default(true),
  includeActivity: z.boolean().default(false),
  ...createDateRangeSchema().shape,
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
