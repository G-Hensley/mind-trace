import type { Intent, Role } from './dtos';
export interface CreateBehaviorLogRequest {
  studentId: string;
  behaviorCategoryId: string;
  notes?: string;
  mood: string;
  intent: Intent;
}

export interface UpdateBehaviorLogRequest {
  behaviorLogId: string;
  behaviorCategoryId?: string;
  notes?: string;
  mood?: string;
  intent?: Intent;
}

export interface BehaviorLogFilterRequest {
  studentId?: string;
  userId?: string;
  behaviorCategoryId?: string;
  dateFrom?: string;
  dateTo?: string;
  intent?: Intent;
  mood?: string;
  page?: number;
  limit?: number;
}

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  dob?: string;
  organizationId: string;
}

export interface BulkCreateStudentsRequest {
  students: CreateStudentRequest[];
  organizationId: string;
}

export interface UpdateStudentRequest {
  studentId: string;
  firstName?: string;
  lastName?: string;
  dob?: string;
  organizationId?: string;
}

export interface StudentSearchRequest {
  organizationId: string;
  query?: string;
  page?: number;
  limit?: number;
}

export interface CreateBehaviorCategoryRequest {
  name: string;
}

export interface UpdateBehaviorCategoryRequest {
  behaviorCategoryId: string;
  name: string;
}

export interface CreateOrganizationRequest {
  name: string;
}

export interface UpdateOrganizationRequest {
  organizationId: string;
  name: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface ChangePasswordRequest {
  email: string;
  oldPassword: string;
  newPassword: string;
}

export interface RefreshTokenRequest {
  token: string;
}

export interface CreateProfileRequest {
  userId: string;
  organizationId: string;
  role: Role;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface UpdateProfileRequest {
  profileId: string;
  organizationId?: string;
  role?: Role;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
}
