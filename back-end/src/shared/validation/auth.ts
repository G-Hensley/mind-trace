import { z } from 'zod';

import { emailSchema, passwordSchema } from './base';

export const signUpSchema = z
  .object({
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: passwordSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(10).max(500),
});

export const passwordResetRequestSchema = z.object({
  email: emailSchema,
});

export const passwordResetSchema = z.object({
  resetToken: z.string().min(1),
  newPassword: passwordSchema,
});

export const emailVerificationSchema = z.object({
  verificationToken: z.string().min(1),
});

export const changePasswordSchema = z.object({
  email: emailSchema,
  currentPassword: passwordSchema,
  newPassword: passwordSchema,
});
