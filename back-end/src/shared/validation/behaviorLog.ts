import { z } from 'zod';
import {
  uuidSchema,
  intentSchema,
  paginationSchema,
  isoDateStringSchema,
  moodSchema,
  notesSchema,
} from './base';

export const createBehaviorLogSchema = z.object({
  studentId: uuidSchema,
  behaviorCategoryId: uuidSchema,
  notes: notesSchema.optional(),
  mood: moodSchema,
  intent: intentSchema,
});

export const updateBehaviorLogSchema = z.object({
  behaviorLogId: uuidSchema,
  behaviorCategoryId: uuidSchema.optional(),
  notes: notesSchema.optional(),
  mood: moodSchema.optional(),
  intent: intentSchema.optional(),
});

export const behaviorLogFiltersSchema = paginationSchema.extend({
  studentId: uuidSchema.optional(),
  userId: uuidSchema.optional(),
  behaviorCategoryId: uuidSchema.optional(),
  dateFrom: isoDateStringSchema.optional(),
  dateTo: isoDateStringSchema.optional(),
  intent: intentSchema.optional(),
  mood: moodSchema.optional(),
});
