import { z } from 'zod';
import type { ZodObject, ZodRawShape, ZodType } from 'zod';
import type { Request, Response, NextFunction } from 'express';

// =============================================================================
// COMMON VALIDATION UTILITIES
// =============================================================================

/**
 * Creates a search query schema with consistent validation
 */
export const createSearchQuerySchema = (minLength = 1, maxLength = 100) =>
  z.string().min(minLength).max(maxLength).trim().optional();

/**
 * Creates a standardized sorting schema
 */
export const createSortingSchema = <T extends readonly [string, ...string[]]>(
  allowedFields: T,
  defaultField?: T[number],
  defaultOrder: 'asc' | 'desc' = 'asc'
) =>
  z.object({
    sortBy: z.enum(allowedFields).default(defaultField || allowedFields[0]),
    sortOrder: z.enum(['asc', 'desc']).default(defaultOrder),
  });

/**
 * Creates a date range filter schema
 */
export const createDateRangeSchema = () =>
  z
    .object({
      dateFrom: z.string().datetime().optional(),
      dateTo: z.string().datetime().optional(),
    })
    .refine(
      data => {
        if (data.dateFrom && data.dateTo) {
          return new Date(data.dateFrom) <= new Date(data.dateTo);
        }
        return true;
      },
      {
        message: 'dateFrom must be before or equal to dateTo',
        path: ['dateTo'],
      }
    );

/**
 * Creates an array schema with size limits
 */
export const createArraySchema = <T extends ZodType>(
  itemSchema: T,
  minItems = 1,
  maxItems = 50
) => z.array(itemSchema).min(minItems).max(maxItems);

/**
 * Creates a bulk operation schema with ID validation
 */
export const createBulkOperationSchema = <T extends ZodType>(
  updatesSchema: T,
  maxItems = 50
) =>
  z.object({
    ids: z.array(z.string().uuid()).min(1).max(maxItems),
    updates: updatesSchema,
  });

// =============================================================================
// VALIDATION HELPERS
// =============================================================================

/**
 * Creates a schema that validates unique values in an array
 */
export const createUniqueArraySchema = <T extends ZodType>(
  itemSchema: T,
  keyExtractor?: (item: any) => any
) =>
  z.array(itemSchema).superRefine((items, ctx) => {
    const keys = items.map(keyExtractor || (item => item));
    const uniqueKeys = new Set(keys);

    if (keys.length !== uniqueKeys.size) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Array items must be unique',
      });
    }
  });

// =============================================================================
// FIELD VALIDATION UTILITIES
// =============================================================================

/**
 * Creates a text field schema with common patterns
 */
export const createTextFieldSchema = (
  minLength = 1,
  maxLength = 255,
  required = true,
  trim = true
) => {
  let schema = z.string();

  if (trim) schema = schema.trim();
  schema = schema.min(minLength).max(maxLength);

  return required ? schema : schema.optional();
};

/**
 * Creates a number range schema
 */
export const createNumberRangeSchema = (
  min?: number,
  max?: number,
  integer = false,
  required = true
) => {
  let schema = integer ? z.number().int() : z.number();

  if (min !== undefined) schema = schema.min(min);
  if (max !== undefined) schema = schema.max(max);

  return required ? schema : schema.optional();
};

/**
 * Creates an enum schema with optional default
 */
export const createEnumSchema = <T extends readonly [string, ...string[]]>(
  values: T,
  required = true
) => {
  const schema = z.enum(values);
  return required ? schema : schema.optional();
};

/**
 * Creates an enum schema with a default value
 */
export const createEnumSchemaWithDefault = <
  T extends readonly [string, ...string[]],
>(
  values: T,
  defaultValue: T[number]
) => z.enum(values).default(defaultValue);

// =============================================================================
// CUSTOM VALIDATION PATTERNS
// =============================================================================

/**
 * Validates that a string contains only alphanumeric characters and common separators
 */
export const alphanumericWithSeparators = z
  .string()
  .regex(
    /^[a-zA-Z0-9\s\-_\.]+$/,
    'Must contain only letters, numbers, spaces, hyphens, underscores, and periods'
  );

/**
 * Validates a slug (URL-friendly string)
 */
export const slugSchema = z
  .string()
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Must be a valid slug (lowercase letters, numbers, and hyphens only)'
  );

/**
 * Validates a phone number (basic pattern)
 */
export const phoneSchema = z
  .string()
  .regex(/^\+?[\d\s\-\(\)]+$/, 'Must be a valid phone number');

/**
 * Validates a hexadecimal color code
 */
export const hexColorSchema = z
  .string()
  .regex(
    /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
    'Must be a valid hex color code'
  );

/**
 * Validates a timezone string
 */
export const timezoneSchema = z
  .string()
  .regex(
    /^[A-Za-z]+\/[A-Za-z_]+$/,
    'Must be a valid timezone (e.g., America/New_York)'
  );

// =============================================================================
// REQUEST/RESPONSE UTILITIES
// =============================================================================

/**
 * Creates a standard API response schema
 */
export const createApiResponseSchema = <T extends ZodType>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    message: z.string().optional(),
    errors: z.array(z.string()).optional(),
  });

/**
 * Creates a paginated response schema
 */
export const createPaginatedResponseSchema = <T extends ZodType>(
  itemSchema: T
) =>
  z.object({
    items: z.array(itemSchema),
    pagination: z.object({
      page: z.number().int().min(1),
      limit: z.number().int().min(1),
      total: z.number().int().min(0),
      totalPages: z.number().int().min(0),
      hasNext: z.boolean(),
      hasPrev: z.boolean(),
    }),
  });

/**
 * Creates a filter schema that extends pagination (for ZodObject types)
 */
export const createFilterSchema = <T extends ZodRawShape>(
  filtersSchema: ZodObject<T>,
  defaultLimit = 20,
  maxLimit = 100
) =>
  filtersSchema.extend({
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(maxLimit).default(defaultLimit),
  });

// =============================================================================
// ERROR HANDLING UTILITIES
// =============================================================================

/**
 * Formats Zod validation errors for API responses
 */
export const formatValidationErrors = (error: z.ZodError) => {
  return error.issues.map(err => ({
    field: err.path.join('.'),
    message: err.message,
    code: err.code,
  }));
};

/**
 * Creates a validation middleware helper
 */
export const createValidationMiddleware = <T extends ZodType>(
  schema: T,
  property: 'body' | 'query' | 'params' = 'body'
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req[property] = schema.parse(req[property]);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          message: 'Validation failed',
          errors: formatValidationErrors(error),
        });
      }
      next(error);
    }
  };
};

// =============================================================================
// COMMON COMBINATIONS
// =============================================================================

/**
 * Creates a comprehensive search schema with pagination, sorting, and date filters
 */
export const createComprehensiveSearchSchema = <
  T extends readonly [string, ...string[]],
>(
  sortFields: T,
  defaultSort?: T[number]
) =>
  z.object({
    query: createSearchQuerySchema(),
    page: z.number().int().min(1).default(1),
    limit: z.number().int().min(1).max(100).default(20),
    ...createSortingSchema(sortFields, defaultSort).shape,
    ...createDateRangeSchema().shape,
  });

/**
 * Creates a standard ID parameter schema for routes
 */
export const createIdParamsSchema = (paramName = 'id') =>
  z.object({
    [paramName]: z.string().uuid(),
  });
