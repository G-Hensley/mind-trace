import { z } from 'zod';

// Basic types
export const uuidSchema = z.uuid();
export const emailSchema = z.email();

// Name schemas with different constraints
export const firstNameSchema = z.string().min(1).max(50).trim();
export const lastNameSchema = z.string().min(1).max(50).trim();
export const organizationNameSchema = z.string().min(1).max(100).trim();
export const generalNameSchema = z.string().min(2).max(50).trim();

// Enums
export const intentSchema = z.enum(['aggressive', 'sensory']);
export const roleSchema = z.enum(['admin', 'user', 'parent']);

// Password with complexity requirements
export const passwordSchema = z
  .string()
  .min(10, 'Password must be at least 10 characters')
  .max(32, 'Password must be no more than 32 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number');

// Date schemas for different use cases
export const dateSchema = z.date();
export const isoDateStringSchema = z.iso.datetime();
export const optionalIsoDateStringSchema = z.iso.datetime().optional();

// URL and optional variants
export const urlSchema = z.url();
export const optionalUrlSchema = z.url().optional();

// Common patterns
export const paginationSchema = z.object({
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(10),
});

// Optional wrapper for any schema
export const optional = <T extends z.ZodTypeAny>(schema: T) =>
  schema.optional();

// Nullable wrapper for any schema
export const nullable = <T extends z.ZodTypeAny>(schema: T) =>
  schema.nullable();
