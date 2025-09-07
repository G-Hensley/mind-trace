import { v4 as uuidv4 } from 'uuid';
import { uuidSchema } from '../validation/base';

export interface BaseEntityProps {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export abstract class BaseEntity {
  readonly id: string;
  readonly createdAt: Date;
  updatedAt: Date;

  constructor(props: BaseEntityProps) {
    this.id = props.id || uuidv4();
    if (props.id) this.validateId(props.id);
    this.createdAt = props.createdAt || new Date();
    this.updatedAt = props.updatedAt || new Date();
  }

  protected touch() {
    this.updatedAt = new Date();
  }

  protected update(changes: Partial<this>) {
    Object.assign(this, changes);
    this.touch();
  }

  protected validateId(id: string) {
    try {
      uuidSchema.parse(id);
    } catch (error) {
      throw new Error('ID must be a valid UUID v4');
    }
  }

  toJson() {
    return {
      id: this.id,
      created_at: this.createdAt.toISOString(),
      updated_at: this.updatedAt.toISOString(),
    };
  }

  static fromJson<T extends BaseEntity>(
    this: new (props: BaseEntityProps) => T,
    json: any
  ): T {
    return new this({
      id: json.id,
      createdAt: new Date(json.createdAt),
      updatedAt: new Date(json.updatedAt),
    });
  }
}
