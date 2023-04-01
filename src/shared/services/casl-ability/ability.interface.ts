import {
  PureAbility as Ability,
  InferSubjects,
  AbilityBuilder,
} from '@casl/ability';
import { Action } from 'src/constants';
import { DeviceSessionEntity } from 'src/modules/device-sessions/entities/device-session.entity';
import { UserEntity } from 'src/modules/users/entities/user.entity';

export type Subjects =
  | InferSubjects<typeof DeviceSessionEntity | typeof UserEntity>
  | 'all';

export type AppAbility = Ability<[Action, Subjects]>;

export abstract class RoleAbility {
  abstract createAbility(): void;
  constructor(
    protected builder: AbilityBuilder<AppAbility>,
    protected user: UserEntity,
  ) {}
}
