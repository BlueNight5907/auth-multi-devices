import { UserAbility } from './casl-ability/user-ability';
import {
  PureAbility as Ability,
  AbilityBuilder,
  AbilityClass,
  ExtractSubjectType,
} from '@casl/ability';
import { Injectable } from '@nestjs/common';
import { Action, RoleType } from 'src/constants';

import { UserEntity } from 'src/modules/users/entities/user.entity';
import {
  AppAbility,
  RoleAbility,
  Subjects,
} from './casl-ability/ability.interface';
import { AdminAbility } from './casl-ability/admin-ability';

@Injectable()
export class CaslAbilityFactory {
  createForUser(user: UserEntity) {
    const builder = new AbilityBuilder<Ability<[Action, Subjects]>>(
      Ability as AbilityClass<AppAbility>,
    );

    const { build } = builder;

    let roleAbility: RoleAbility;

    if (user.role === RoleType.ADMIN) {
      roleAbility = new AdminAbility(builder, user);
    } else {
      roleAbility = new UserAbility(builder, user);
    }

    this.defineAbility(roleAbility);

    return build({
      detectSubjectType: (item) =>
        item.constructor as ExtractSubjectType<Subjects>,
    });
  }

  defineAbility(roleAbility: RoleAbility) {
    roleAbility.createAbility();
  }
}
