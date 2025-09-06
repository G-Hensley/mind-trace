export type Intent = 'aggressive' | 'sensory';

export interface UserDTO {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string | null;
}

export interface ProfileDTO {
  user_id: string;
  organization_id: string;
  avatar: string | null;
  role: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
}

export interface BehaviorCategoryDTO {
  id: string;
  name: string;
}

export interface BehaviorLogDTO {
  id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  student_id: string;
  behavior_category_id: string;
  notes: string | null;
  mood: string;
  intent: Intent;
}

export interface StudentDTO {
  id: string;
  first_name: string;
  last_name: string;
  created_at: string;
  updated_at: string;
  dob: string | null;
  organization_id: string;
}

export interface OrganizationDTO {
  id: string;
  name: string;
}

