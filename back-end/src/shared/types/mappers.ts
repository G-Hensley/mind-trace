import type {
  UserDTO,
  ProfileDTO,
  BehaviorCategoryDTO,
  BehaviorLogDTO,
  StudentDTO,
  OrganizationDTO,
} from './dtos';

import type {
  CreateBehaviorLogRequest,
  UpdateBehaviorLogRequest,
  CreateStudentRequest,
  UpdateStudentRequest,
  CreateProfileRequest,
  UpdateProfileRequest,
  CreateBehaviorCategoryRequest,
  CreateOrganizationRequest,
  UpdateOrganizationRequest,
  UpdateBehaviorCategoryRequest,
} from './requests';

export class UserMapper {
  static dtoToFrontend(dto: UserDTO) {
    return {
      id: dto.id,
      email: dto.email,
      createdAt: dto.created_at,
      lastSignInAt: dto.last_sign_in_at,
    };
  }
}

export class BehaviorLogMapper {
  static createRequestToDTO(
    request: CreateBehaviorLogRequest,
    userId: string
  ): Omit<BehaviorLogDTO, 'id' | 'created_at' | 'updated_at'> {
    return {
      user_id: userId,
      student_id: request.studentId,
      behavior_category_id: request.behaviorCategoryId,
      notes: request.notes || null,
      mood: request.mood,
      intent: request.intent,
    };
  }

  static updateRequestToPartialDTO(
    request: UpdateBehaviorLogRequest
  ): Partial<
    Pick<BehaviorLogDTO, 'behavior_category_id' | 'notes' | 'mood' | 'intent'>
  > {
    const updates: Partial<
      Pick<BehaviorLogDTO, 'behavior_category_id' | 'notes' | 'mood' | 'intent'>
    > = {};

    if (request.behaviorCategoryId) {
      updates.behavior_category_id = request.behaviorCategoryId;
    }

    if (request.notes !== undefined) {
      updates.notes = request.notes || null;
    }

    if (request.mood) {
      updates.mood = request.mood;
    }

    if (request.intent) {
      updates.intent = request.intent;
    }

    return updates;
  }

  static dtoToFrontend(dto: BehaviorLogDTO) {
    return {
      id: dto.id,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      userId: dto.user_id,
      studentId: dto.student_id,
      behaviorCategoryId: dto.behavior_category_id,
      notes: dto.notes,
      mood: dto.mood,
      intent: dto.intent,
    };
  }
}

export class StudentMapper {
  static createRequestToDTO(
    request: CreateStudentRequest
  ): Omit<StudentDTO, 'id' | 'created_at' | 'updated_at'> {
    return {
      first_name: request.firstName,
      last_name: request.lastName,
      dob: request.dob || null,
      organization_id: request.organizationId,
    };
  }

  static updateRequestToPartialDTO(
    request: UpdateStudentRequest
  ): Partial<
    Pick<StudentDTO, 'first_name' | 'last_name' | 'dob' | 'organization_id'>
  > {
    const updates: Partial<
      Pick<StudentDTO, 'first_name' | 'last_name' | 'dob' | 'organization_id'>
    > = {};

    if (request.firstName) updates.first_name = request.firstName;
    if (request.lastName) updates.last_name = request.lastName;
    if (request.dob !== undefined) updates.dob = request.dob || null;
    if (request.organizationId)
      updates.organization_id = request.organizationId;

    return updates;
  }

  static dtoToFrontend(dto: StudentDTO) {
    return {
      id: dto.id,
      firstName: dto.first_name,
      lastName: dto.last_name,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
      dob: dto.dob,
      organizationId: dto.organization_id,
    };
  }
}

export class ProfileMapper {
  static createRequestToDTO(
    request: CreateProfileRequest
  ): Omit<ProfileDTO, 'created_at' | 'updated_at'> {
    return {
      user_id: request.userId,
      organization_id: request.organizationId,
      role: request.role,
      first_name: request.firstName,
      last_name: request.lastName,
      avatar: request.avatar || null,
    };
  }

  static updateRequestToPartialDTO(
    request: UpdateProfileRequest
  ): Partial<
    Pick<
      ProfileDTO,
      'organization_id' | 'role' | 'first_name' | 'last_name' | 'avatar'
    >
  > {
    const updates: Partial<
      Pick<
        ProfileDTO,
        'organization_id' | 'role' | 'first_name' | 'last_name' | 'avatar'
      >
    > = {};

    if (request.organizationId)
      updates.organization_id = request.organizationId;
    if (request.role) updates.role = request.role;
    if (request.firstName) updates.first_name = request.firstName;
    if (request.lastName) updates.last_name = request.lastName;
    if (request.avatar !== undefined) updates.avatar = request.avatar;

    return updates;
  }

  static dtoToFrontend(dto: ProfileDTO) {
    return {
      userId: dto.user_id,
      organizationId: dto.organization_id,
      role: dto.role,
      firstName: dto.first_name,
      lastName: dto.last_name,
      avatar: dto.avatar,
      createdAt: dto.created_at,
      updatedAt: dto.updated_at,
    };
  }
}

export class BehaviorCategoryMapper {
  static createRequestToDTO(
    request: CreateBehaviorCategoryRequest
  ): Omit<BehaviorCategoryDTO, 'id'> {
    return {
      name: request.name,
    };
  }

  static updateRequestToPartialDTO(
    request: UpdateBehaviorCategoryRequest
  ): Pick<BehaviorCategoryDTO, 'name'> {
    return {
      name: request.name,
    };
  }

  static dtoToFrontend(dto: BehaviorCategoryDTO) {
    return {
      id: dto.id,
      name: dto.name,
    };
  }
}

export class OrganizationMapper {
  static createRequestToDTO(
    request: CreateOrganizationRequest
  ): Omit<OrganizationDTO, 'id'> {
    return {
      name: request.name,
    };
  }

  static updateRequestToPartialDTO(
    request: UpdateOrganizationRequest
  ): Pick<OrganizationDTO, 'name'> {
    return {
      name: request.name,
    };
  }

  static dtoToFrontend(dto: OrganizationDTO) {
    return {
      id: dto.id,
      name: dto.name,
    };
  }
}
