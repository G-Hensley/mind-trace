import { z } from 'zod';

import {
  uuidSchema,
  firstNameSchema,
  lastNameSchema,
  isoDateStringSchema,
  paginationSchema,
} from './base';
import { createSearchQuerySchema, createArraySchema } from './utils';

export const createStudentSchema = z.object({
  firstName: firstNameSchema,
  lastName: lastNameSchema,
  dob: isoDateStringSchema.optional(),
  organizationId: uuidSchema,
});

export const updateStudentSchema = z.object({
  studentId: uuidSchema,
  firstName: firstNameSchema.optional(),
  lastName: lastNameSchema.optional(),
  dob: isoDateStringSchema.optional(),
  organizationId: uuidSchema.optional(),
});

export const studentSearchSchema = paginationSchema.extend({
  organizationId: uuidSchema,
  query: createSearchQuerySchema(),
});

export const bulkCreateStudentsSchema = z.object({
  students: createArraySchema(createStudentSchema, 1, 100),
  organizationId: uuidSchema,
});

// Alias for backward compatibility if needed
export const studentFiltersSchema = studentSearchSchema;
