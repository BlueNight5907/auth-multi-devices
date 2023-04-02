import { ApiProperty } from '@nestjs/swagger';
import { plainToClassFromExist } from 'class-transformer';
import { AbstractEntity } from '../abstract.entity';

export type AbstractDtoOptions = {
  excludeFields?: boolean;
  ingnoreAssignValues?: boolean;
};
export class AbstractDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  private assignValue(entity: AbstractEntity, excludeFields?: boolean) {
    if (excludeFields) {
      delete entity.createdAt;
      delete entity.updatedAt;
      delete entity.id;
    }
    plainToClassFromExist(this, entity);
  }

  constructor(entity: AbstractEntity, options?: AbstractDtoOptions) {
    if (options?.ingnoreAssignValues) {
      if (!options?.excludeFields) {
        this.createdAt = entity.createdAt;
        this.updatedAt = entity.updatedAt;
        this.id = entity.id;
      }
    } else {
      this.assignValue(entity, options?.excludeFields);
    }
  }
}
