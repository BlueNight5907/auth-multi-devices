import { ApiProperty } from '@nestjs/swagger';
import { plainToClassFromExist } from 'class-transformer';
import type { AbstractEntity } from '../abstract.entity';

export class AbstractDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  private assignValue(entity: AbstractEntity, excludeFields?: boolean) {
    const newEntity: Partial<AbstractEntity> = Object.assign({}, entity);
    if (excludeFields) {
      delete newEntity.id;
      delete newEntity.createdAt;
      delete newEntity.updatedAt;
    }
    plainToClassFromExist(this, entity);
  }

  constructor(
    entity: AbstractEntity,
    options?: { excludeFields?: boolean; ingnoreAssignValues: boolean },
  ) {
    if (options?.ingnoreAssignValues) {
      if (!options?.excludeFields) {
        this.id = entity.id;
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
      }
    } else {
      this.assignValue(entity, options?.excludeFields);
    }
  }
}
