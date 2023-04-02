import {
  PureAbility as Ability,
  AbilityBuilder,
  InferSubjects,
} from '@casl/ability';
import { Roles } from 'src/common/dto/roles.dto';
import { Action } from 'src/constants';
import { DeviceSessionEntity } from 'src/modules/device-sessions/entities/device-session.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export type Subjects =
  | InferSubjects<typeof DeviceSessionEntity | typeof UserEntity | typeof Roles>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

export abstract class RoleAbility {
  abstract createAbility(): void;
  constructor(
    protected builder: AbilityBuilder<AppAbility>,
    protected user: UserEntity,
  ) {}
}
