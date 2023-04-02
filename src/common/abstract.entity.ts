import {
  CreateDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import type { AbstractDtoOptions, AbstractDto } from './dto/abstract.dto';
import type { Constructor } from './types';

/**
 * Abstract Entity
 * @description This class is an abstract class for all entities.
 */
export interface IAbstractEntity<
  DTO extends AbstractDto,
  O extends AbstractDtoOptions,
> {
  id: number;
  createdAt: Date;
  updatedAt: Date;

  toDto(options?: O): DTO;
}

export abstract class AbstractEntity<
  DTO extends AbstractDto = AbstractDto,
  O extends AbstractDtoOptions = AbstractDtoOptions,
> implements IAbstractEntity<DTO, O>
{
  @PrimaryGeneratedColumn('increment')
  id: number;

  @CreateDateColumn({
    type: 'timestamp',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
  })
  updatedAt: Date;

  protected dtoClass?: Constructor<DTO, [AbstractEntity, O?]>;

  toDto(options?: O): DTO {
    const dtoClass = this.dtoClass;
    if (!dtoClass) {
      throw new Error(
        `You need to use @UseDto on class (${this.constructor.name}) be able to call toDto function`,
      );
    }

    return new dtoClass(this, options);
  }
}
