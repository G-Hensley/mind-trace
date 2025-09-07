import { describe, it, expect, beforeEach } from 'vitest';
import { User } from '../../back-end/src/domains/user/entities/User';

describe('User Entity', () => {
  const validEmail = 'test@example.com';
  const validPasswordHash = 'hashedpassword123';

  describe('Constructor', () => {
    it('should create user with required email', () => {
      const user = new User({ email: validEmail });

      expect(user.email).toBe(validEmail);
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      expect(user.lastSignInAt).toBeNull();
      expect(user.hasPassword()).toBe(false);
    });

    it('should normalize email to lowercase and trim whitespace', () => {
      const user = new User({ email: '  TEST@EXAMPLE.COM  ' });

      expect(user.email).toBe('test@example.com');
    });

    it('should accept optional password hash', () => {
      const user = new User({
        email: validEmail,
        passwordHash: validPasswordHash,
      });

      expect(user.hasPassword()).toBe(true);
      expect(user.getPasswordHash()).toBe(validPasswordHash);
    });

    it('should accept optional lastSignInAt', () => {
      const signInDate = new Date('2023-01-01T10:00:00Z');
      const user = new User({
        email: validEmail,
        lastSignInAt: signInDate,
      });

      expect(user.lastSignInAt).toEqual(signInDate);
    });

    it('should throw error for invalid email', () => {
      expect(() => new User({ email: 'invalid-email' })).toThrow(
        'Invalid email format'
      );
      expect(() => new User({ email: '' })).toThrow('Invalid email format');
      expect(() => new User({ email: 'test@' })).toThrow(
        'Invalid email format'
      );
    });
  });

  describe('Password Management', () => {
    let user: User;

    beforeEach(() => {
      user = new User({ email: validEmail });
    });

    it('should set password hash', () => {
      const originalUpdatedAt = user.updatedAt;

      // Wait a tiny bit to ensure timestamp difference
      setTimeout(() => {
        user.setPasswordHash(validPasswordHash);

        expect(user.hasPassword()).toBe(true);
        expect(user.getPasswordHash()).toBe(validPasswordHash);
        expect(user.updatedAt.getTime()).toBeGreaterThan(
          originalUpdatedAt.getTime()
        );
      }, 1);
    });

    it('should throw error for empty password hash', () => {
      expect(() => user.setPasswordHash('')).toThrow(
        'Password hash cannot be empty'
      );
      expect(() => user.setPasswordHash('   ')).toThrow(
        'Password hash cannot be empty'
      );
    });

    it('should update timestamp when password is changed', () => {
      const originalUpdatedAt = user.updatedAt;

      user.setPasswordHash(validPasswordHash);

      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime()
      );
    });
  });

  describe('Sign-in Tracking', () => {
    let user: User;

    beforeEach(() => {
      user = new User({ email: validEmail });
    });

    it('should record sign-in with current timestamp', () => {
      const beforeSignIn = new Date();
      user.recordSignIn();
      const afterSignIn = new Date();

      expect(user.lastSignInAt).toBeDefined();
      expect(user.lastSignInAt!.getTime()).toBeGreaterThanOrEqual(
        beforeSignIn.getTime()
      );
      expect(user.lastSignInAt!.getTime()).toBeLessThanOrEqual(
        afterSignIn.getTime()
      );
    });

    it('should update updatedAt timestamp when recording sign-in', () => {
      const originalUpdatedAt = user.updatedAt;

      user.recordSignIn();

      expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(
        originalUpdatedAt.getTime()
      );
    });
  });

  describe('DTO Conversion', () => {
    it('should convert to DTO format', () => {
      const signInDate = new Date('2023-01-01T10:00:00Z');
      const user = new User({
        email: validEmail,
        lastSignInAt: signInDate,
      });

      const dto = user.toDto();

      expect(dto).toEqual({
        id: user.id,
        email: validEmail,
        created_at: user.createdAt.toISOString(),
        last_sign_in_at: signInDate.toISOString(),
      });
    });

    it('should handle null lastSignInAt in DTO', () => {
      const user = new User({ email: validEmail });

      const dto = user.toDto();

      expect(dto.last_sign_in_at).toBeNull();
    });

    it('should create user from DTO', () => {
      const dto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: validEmail,
        created_at: '2023-01-01T10:00:00.000Z',
        last_sign_in_at: '2023-01-02T10:00:00.000Z',
      };

      const user = User.fromDto(dto);

      expect(user.id).toBe(dto.id);
      expect(user.email).toBe(dto.email);
      expect(user.createdAt).toEqual(new Date(dto.created_at));
      expect(user.lastSignInAt).toEqual(new Date(dto.last_sign_in_at));
    });

    it('should handle null last_sign_in_at when creating from DTO', () => {
      const dto = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: validEmail,
        created_at: '2023-01-01T10:00:00.000Z',
        last_sign_in_at: null,
      };

      const user = User.fromDto(dto);

      expect(user.lastSignInAt).toBeNull();
    });
  });

  describe('JSON Serialization', () => {
    it('should serialize to JSON with snake_case properties', () => {
      const signInDate = new Date('2023-01-01T10:00:00Z');
      const user = new User({
        email: validEmail,
        lastSignInAt: signInDate,
      });

      const json = user.toJson();

      expect(json).toEqual({
        id: user.id,
        created_at: user.createdAt.toISOString(),
        updated_at: user.updatedAt.toISOString(),
        email: validEmail,
        last_sign_in_at: signInDate.toISOString(),
      });
    });

    it('should create user from JSON', () => {
      const json = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: validEmail,
        created_at: '2023-01-01T10:00:00.000Z',
        updated_at: '2023-01-01T10:00:00.000Z',
        last_sign_in_at: '2023-01-02T10:00:00.000Z',
      };

      const user = User.createFromJson(json);

      expect(user.id).toBe(json.id);
      expect(user.email).toBe(json.email);
      expect(user.createdAt).toEqual(new Date(json.created_at));
      expect(user.updatedAt).toEqual(new Date(json.updated_at));
      expect(user.lastSignInAt).toEqual(new Date(json.last_sign_in_at));
    });
  });

  describe('Edge Cases', () => {
    it('should handle user creation with all properties', () => {
      const props = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: validEmail,
        passwordHash: validPasswordHash,
        createdAt: new Date('2023-01-01T10:00:00Z'),
        updatedAt: new Date('2023-01-01T11:00:00Z'),
        lastSignInAt: new Date('2023-01-02T10:00:00Z'),
      };

      const user = new User(props);

      expect(user.id).toBe(props.id);
      expect(user.email).toBe(props.email);
      expect(user.getPasswordHash()).toBe(props.passwordHash);
      expect(user.createdAt).toEqual(props.createdAt);
      expect(user.updatedAt).toEqual(props.updatedAt);
      expect(user.lastSignInAt).toEqual(props.lastSignInAt);
    });

    it('should create different users with unique IDs', () => {
      const user1 = new User({ email: 'user1@example.com' });
      const user2 = new User({ email: 'user2@example.com' });

      expect(user1.id).not.toBe(user2.id);
      expect(user1.email).not.toBe(user2.email);
    });
  });
});
