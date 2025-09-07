import { BaseEntity, BaseEntityProps } from '@/shared/types/BaseEntity';
import { UserDTO } from '@/shared/types/dtos';
import { emailSchema } from '@/shared/validation/base';

export interface UserProps extends BaseEntityProps {
  email: string;
  passwordHash?: string;
  lastSignInAt?: Date | null;
}

export class User extends BaseEntity {
  // Explicitly declare inherited properties for TypeScript
  declare readonly id: string;
  declare readonly createdAt: Date;
  declare updatedAt: Date;

  // User-specific properties
  readonly email: string;
  private _passwordHash: string;
  lastSignInAt: Date | null;

  constructor(props: UserProps) {
    super(props);
    // Normalize email first, then validate
    const normalizedEmail = props.email.toLowerCase().trim();
    this.validateEmail(normalizedEmail);
    this.email = normalizedEmail;
    this._passwordHash = props.passwordHash || '';
    this.lastSignInAt = props.lastSignInAt || null;
  }

  // Password management
  setPasswordHash(hash: string): void {
    if (!hash || hash.trim().length === 0) {
      throw new Error('Password hash cannot be empty');
    }
    this._passwordHash = hash;
    this.touch();
  }

  getPasswordHash(): string {
    return this._passwordHash;
  }

  hasPassword(): boolean {
    return this._passwordHash.length > 0;
  }

  // Sign-in tracking
  recordSignIn(): void {
    this.lastSignInAt = new Date();
    this.touch();
  }

  // Validation
  private validateEmail(email: string): void {
    try {
      emailSchema.parse(email);
    } catch (error) {
      throw new Error('Invalid email format');
    }
  }

  // DTO conversion
  toDto(): UserDTO {
    return {
      id: this.id,
      email: this.email,
      created_at: this.createdAt.toISOString(),
      last_sign_in_at: this.lastSignInAt?.toISOString() || null,
    };
  }

  toJson() {
    return {
      ...super.toJson(),
      email: this.email,
      last_sign_in_at: this.lastSignInAt?.toISOString() || null,
    };
  }

  static createFromJson(json: any): User {
    return new User({
      id: json.id,
      email: json.email,
      createdAt: new Date(json.created_at || json.createdAt),
      updatedAt: new Date(json.updated_at || json.updatedAt),
      lastSignInAt:
        json.last_sign_in_at || json.lastSignInAt
          ? new Date(json.last_sign_in_at || json.lastSignInAt)
          : null,
    });
  }

  static fromDto(dto: UserDTO): User {
    return new User({
      id: dto.id,
      email: dto.email,
      createdAt: new Date(dto.created_at),
      lastSignInAt: dto.last_sign_in_at ? new Date(dto.last_sign_in_at) : null,
    });
  }
}
