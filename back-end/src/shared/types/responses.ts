import type {
  UserDTO,
  ProfileDTO,
  BehaviorLogDTO,
  StudentDTO,
  OrganizationDTO,
  Intent,
} from './dtos';

// Base response wrapper
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  success: boolean;
  statusCode?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
  success: boolean;
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface AuthResponse {
  user: UserDTO;
  profile: ProfileDTO;
  token: string;
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface BehaviorLogWithDetailsResponse extends BehaviorLogDTO {
  student_name: string;
  behavior_category_name: string;
  user_name: string;
}

export interface StudentWithStatsResponse extends StudentDTO {
  total_logs: number;
  recent_mood: string | null;
  last_logged_at: string | null;
}

export interface ProfileWithOrgResponse extends ProfileDTO {
  organization_name: string;
}

export interface BulkCreateResponse<T> {
  created: T[];
  failed: Array<{
    index: number;
    error: string;
    data: any;
  }>;
  success_count: number;
  failure_count: number;
}

export interface BehaviorAnalyticsResponse {
  student_id: string;
  total_logs: number;
  mood_distribution: Record<string, number>;
  intent_distribution: Record<Intent, number>;
  weekly_trends: Array<{
    week: string;
    count: number;
    aggressive_count: number;
    sensory_count: number;
    behavior_breakdown: Record<string, number>;
    mood_breakdown: Record<string, number>;
  }>;
  monthly_trends: Array<{
    month: string;
    count: number;
    aggressive_count: number;
    sensory_count: number;
    behavior_breakdown: Record<string, number>;
    mood_breakdown: Record<string, number>;
  }>;
}

export interface DashboardStatsResponse {
  total_students: number;
  total_logs_today: number;
  total_logs_this_week: number;
  recent_logs: BehaviorLogWithDetailsResponse[];
  critical_incidents_today: number;
}

export interface SearchResponse<T> extends PaginatedResponse<T> {
  query: string;
  filters_applied: Record<string, any>;
}

export interface ValidationErrorResponse {
  success: false;
  error: string;
  validation_errors: Array<{
    field: string;
    message: string;
  }>;
  statusCode: 400;
}

export interface NotFoundResponse {
  success: false;
  error: string;
  resource: string;
  id: string;
  statusCode: 404;
}

export interface FileUploadResponse {
  url: string;
  filename: string;
  size: number;
  mime_type: string;
}

export interface HealthCheckResponse {
  status: 'ok' | 'error';
  database: 'connected' | 'disconnected';
  timestamp: string;
  version?: string;
}

export interface OrganizationWithMembersResponse extends OrganizationDTO {
  member_count: number;
  student_count: number;
  members?: ProfileWithOrgResponse[];
}

export interface ReportGenerationResponse {
  report_id: string;
  status: 'generating' | 'completed' | 'failed';
  download_url?: string;
  generated_at?: string;
  expires_at?: string;
  error_message?: string;
  success: boolean;
  message?: string;
  statusCode?: number;
}
