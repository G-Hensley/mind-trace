import { z } from 'zod';

import {
  uuidSchema,
  firstNameSchema,
  lastNameSchema,
  roleSchema,
  urlSchema,
  paginationSchema,
} from './base';
import {
  createSearchQuerySchema,
  createDateRangeSchema,
  createBulkOperationSchema,
} from './utils';

export const createProfileSchema = z.object({
  userId: uuidSchema,
  organizationId: uuidSchema,
  role: roleSchema,
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  avatar: urlSchema.optional(),
});

export const updateProfileSchema = z.object({
  profileId: uuidSchema,
  organizationId: uuidSchema.optional(),
  role: roleSchema.optional(),
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  avatar: urlSchema.nullable().optional(),
});

// Profile search and filtering
export const profileSearchSchema = paginationSchema.extend({
  organizationId: uuidSchema.optional(),
  role: roleSchema.optional(),
  query: createSearchQuerySchema(),
});

// Profile filters for admin dashboards
export const profileFiltersSchema = paginationSchema.extend({
  organizationId: uuidSchema.optional(),
  role: roleSchema.optional(),
  hasAvatar: z.boolean().optional(),
  ...createDateRangeSchema().shape,
});

// Bulk operations
export const bulkUpdateProfilesSchema = createBulkOperationSchema(
  z.object({
    organizationId: uuidSchema.optional(),
    role: roleSchema.optional(),
  }),
  50
);

// Profile validation for user settings
export const updateProfileSettingsSchema = z.object({
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  avatar: urlSchema.nullable().optional(),
});

// Organization role assignment
export const assignRoleSchema = z.object({
  profileId: uuidSchema,
  organizationId: uuidSchema,
  role: roleSchema,
});

// Profile ID validation for route parameters
export const profileParamsSchema = z.object({
  profileId: uuidSchema,
});

export const organizationProfilesSchema = paginationSchema.extend({
  organizationId: uuidSchema,
  role: roleSchema.optional(),
});
