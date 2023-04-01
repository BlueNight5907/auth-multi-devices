import { Action } from 'src/constants';
import { RoleAbility } from './ability.interface';

export class AdminAbility extends RoleAbility {
  createAbility(): void {
    const { can } = this.builder;
    can(Action.Manage, 'all'); // read-write access to everything
  }
}
