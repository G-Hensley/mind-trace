import { z } from 'zod';

import {
  uuidSchema,
  firstNameSchema,
  lastNameSchema,
  isoDateStringSchema,
  paginationSchema,
} from './base';

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
  query: z.string().min(1).max(100).optional(),
});

export const bulkCreateStudentsSchema = z.object({
  students: z.array(createStudentSchema),
  organizationId: uuidSchema,
});

// Alias for backward compatibility if needed
export const studentFiltersSchema = studentSearchSchema;
