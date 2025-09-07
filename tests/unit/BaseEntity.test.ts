import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  BaseEntity,
  BaseEntityProps,
} from '../../back-end/src/shared/types/BaseEntity';

// Concrete implementation of BaseEntity for testing
class TestEntity extends BaseEntity {
  name: string;

  constructor(props: BaseEntityProps & { name?: string }) {
    super(props);
    this.name = props.name || 'Test Entity';
  }
}

describe('BaseEntity', () => {
  describe('Constructor', () => {
    it('should create entity with auto-generated UUID when no id provided', () => {
      const entity = new TestEntity({});

      expect(entity.id).toBeDefined();
      expect(typeof entity.id).toBe('string');
      expect(entity.id).toMatch(
        /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });

    it('should use provided id when given', () => {
      const providedId = '123e4567-e89b-12d3-a456-426614174000';
      const entity = new TestEntity({ id: providedId });

      expect(entity.id).toBe(providedId);
    });

    it('should set createdAt to current date when not provided', () => {
      const beforeCreation = new Date();
      const entity = new TestEntity({});
      const afterCreation = new Date();

      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.createdAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime()
      );
      expect(entity.createdAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime()
      );
    });

    it('should use provided createdAt when given', () => {
      const providedDate = new Date('2023-01-01T10:00:00Z');
      const entity = new TestEntity({ createdAt: providedDate });

      expect(entity.createdAt).toEqual(providedDate);
    });

    it('should set updatedAt to current date when not provided', () => {
      const beforeCreation = new Date();
      const entity = new TestEntity({});
      const afterCreation = new Date();

      expect(entity.updatedAt).toBeInstanceOf(Date);
      expect(entity.updatedAt.getTime()).toBeGreaterThanOrEqual(
        beforeCreation.getTime()
      );
      expect(entity.updatedAt.getTime()).toBeLessThanOrEqual(
        afterCreation.getTime()
      );
    });

    it('should use provided updatedAt when given', () => {
      const providedDate = new Date('2023-01-01T10:00:00Z');
      const entity = new TestEntity({ updatedAt: providedDate });

      expect(entity.updatedAt).toEqual(providedDate);
    });

    it('should set both createdAt and updatedAt to same time when neither provided', () => {
      const entity = new TestEntity({});

      expect(entity.createdAt).toEqual(entity.updatedAt);
    });
  });

  describe('touch method', () => {
    it('should update the updatedAt timestamp', async () => {
      const entity = new TestEntity({});
      const originalUpdatedAt = entity.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      // Access the protected method via any cast for testing
      (entity as any).touch();

      expect(entity.updatedAt).not.toEqual(originalUpdatedAt);
      expect(entity.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });

    it('should not modify createdAt', async () => {
      const entity = new TestEntity({});
      const originalCreatedAt = entity.createdAt;

      await new Promise(resolve => setTimeout(resolve, 10));
      (entity as any).touch();

      expect(entity.createdAt).toEqual(originalCreatedAt);
    });
  });

  describe('update method', () => {
    it('should update entity properties and touch timestamp', async () => {
      const entity = new TestEntity({ name: 'Original Name' });
      const originalUpdatedAt = entity.updatedAt;

      await new Promise(resolve => setTimeout(resolve, 10));

      // Access the protected method via any cast for testing
      (entity as any).update({ name: 'Updated Name' });

      expect(entity.name).toBe('Updated Name');
      expect(entity.updatedAt.getTime()).toBeGreaterThan(
        originalUpdatedAt.getTime()
      );
    });

    it('should only update provided properties', () => {
      const entity = new TestEntity({ name: 'Original Name' });
      const originalId = entity.id;

      (entity as any).update({ name: 'Updated Name' });

      expect(entity.name).toBe('Updated Name');
      expect(entity.id).toBe(originalId);
    });
  });

  describe('validateId method', () => {
    it('should not throw for valid UUID v4', () => {
      const entity = new TestEntity({});
      const validUuid = '123e4567-e89b-12d3-a456-426614174000';

      expect(() => (entity as any).validateId(validUuid)).not.toThrow();
    });

    it('should throw for invalid UUID format', () => {
      const entity = new TestEntity({});
      const invalidUuid = 'not-a-uuid';

      expect(() => (entity as any).validateId(invalidUuid)).toThrow(
        'ID must be a valid UUID v4'
      );
    });

    it('should throw for empty string', () => {
      const entity = new TestEntity({});

      expect(() => (entity as any).validateId('')).toThrow();
    });
  });

  describe('toJson method', () => {
    it('should return object with id, created_at, and updated_at as ISO strings', () => {
      const testDate = new Date('2023-01-01T10:00:00Z');
      const entity = new TestEntity({
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: testDate,
        updatedAt: testDate,
      });

      const json = entity.toJson();

      expect(json).toEqual({
        id: '123e4567-e89b-12d3-a456-426614174000',
        created_at: '2023-01-01T10:00:00.000Z',
        updated_at: '2023-01-01T10:00:00.000Z',
      });
    });

    it('should return current timestamps when entity was created with defaults', () => {
      const entity = new TestEntity({});
      const json = entity.toJson();

      expect(json.id).toBe(entity.id);
      expect(json.created_at).toBe(entity.createdAt.toISOString());
      expect(json.updated_at).toBe(entity.updatedAt.toISOString());
    });
  });

  describe('fromJson static method', () => {
    it('should create entity instance from JSON data', () => {
      const jsonData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T10:00:00.000Z',
        updatedAt: '2023-01-01T10:00:00.000Z',
        name: 'Test Entity',
      };

      const entity = TestEntity.fromJson(jsonData);

      expect(entity).toBeInstanceOf(TestEntity);
      expect(entity.id).toBe(jsonData.id);
      expect(entity.createdAt).toEqual(new Date(jsonData.createdAt));
      expect(entity.updatedAt).toEqual(new Date(jsonData.updatedAt));
      expect(entity.name).toBe('Test Entity');
    });

    it('should handle missing optional fields', () => {
      const jsonData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
      };

      const entity = TestEntity.fromJson(jsonData);

      expect(entity.id).toBe(jsonData.id);
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should work with DTO format (snake_case)', () => {
      const jsonData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        created_at: '2023-01-01T10:00:00.000Z',
        updated_at: '2023-01-02T10:00:00.000Z',
      };

      const entity = TestEntity.fromJson({
        id: jsonData.id,
        createdAt: jsonData.created_at,
        updatedAt: jsonData.updated_at,
      });

      expect(entity.id).toBe(jsonData.id);
      expect(entity.createdAt).toEqual(new Date(jsonData.created_at));
      expect(entity.updatedAt).toEqual(new Date(jsonData.updated_at));
    });

    it('should create different entity types correctly', () => {
      class AnotherTestEntity extends BaseEntity {
        value: number;

        constructor(props: BaseEntityProps & { value?: number }) {
          super(props);
          this.value = props.value || 0;
        }
      }

      const jsonData = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        createdAt: '2023-01-01T10:00:00.000Z',
        updatedAt: '2023-01-01T10:00:00.000Z',
      };

      const entity = AnotherTestEntity.fromJson(jsonData);

      expect(entity).toBeInstanceOf(AnotherTestEntity);
      expect(entity).not.toBeInstanceOf(TestEntity);
      expect(entity.value).toBe(0);
    });
  });

  describe('Edge Cases', () => {
    it('should handle entity creation with partial props', () => {
      const entity = new TestEntity({
        id: '123e4567-e89b-12d3-a456-426614174000',
      });

      expect(entity.id).toBe('123e4567-e89b-12d3-a456-426614174000');
      expect(entity.createdAt).toBeInstanceOf(Date);
      expect(entity.updatedAt).toBeInstanceOf(Date);
    });

    it('should create unique ids for multiple instances', () => {
      const entity1 = new TestEntity({});
      const entity2 = new TestEntity({});

      expect(entity1.id).not.toBe(entity2.id);
    });

    it('should handle Date conversion from string timestamps', () => {
      const entity = TestEntity.fromJson({
        createdAt: '2023-01-01T10:00:00.000Z',
        updatedAt: '2023-01-02T10:00:00.000Z',
      });

      expect(entity.createdAt).toEqual(new Date('2023-01-01T10:00:00.000Z'));
      expect(entity.updatedAt).toEqual(new Date('2023-01-02T10:00:00.000Z'));
    });
  });
});
