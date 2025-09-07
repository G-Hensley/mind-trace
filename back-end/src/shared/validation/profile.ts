import { z } from 'zod';

import {
  uuidSchema,
  firstNameSchema,
  lastNameSchema,
  roleSchema,
  urlSchema,
  paginationSchema,
} from './base';

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
  query: z.string().min(1).max(100).trim().optional(),
});

// Profile filters for admin dashboards
export const profileFiltersSchema = z.object({
  organizationId: uuidSchema.optional(),
  role: roleSchema.optional(),
  createdAfter: z.string().datetime().optional(),
  createdBefore: z.string().datetime().optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
});

// Bulk operations
export const bulkUpdateProfilesSchema = z.object({
  profileIds: z.array(uuidSchema).min(1).max(50),
  updates: z.object({
    organizationId: uuidSchema.optional(),
    role: roleSchema.optional(),
  }),
});

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

export const organizationProfilesSchema = z.object({
  organizationId: uuidSchema,
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(20),
  role: roleSchema.optional(),
});
