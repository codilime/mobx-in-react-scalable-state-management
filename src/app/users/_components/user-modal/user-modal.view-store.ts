import { inject } from 'react-ioc';
import { makeAutoObservable } from 'mobx';
import { User } from '@/generated/graphql';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';
import { omit } from 'lodash';

export class UserModalViewStore {
  private usersDataStore = inject(this, UsersDataStore);

  private state: State = {
    userId: null,
    opened: false,
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get mode() {
    return this.state.userId === null ? 'create' : 'edit';
  }

  get opened() {
    return this.state.opened;
  }

  get user() {
    if (this.state.userId === null) {
      return null;
    } else {
      return this.usersDataStore.findUserById(this.state.userId);
    }
  }

  get defaultValues(): UserFormData {
    if (this.mode === 'edit' && this.user) {
      return omit(this.user, 'id', '__typename');
    } else {
      return { firstName: '', lastName: '', email: '' };
    }
  }

  open(userId: State['userId'] = null) {
    this.state.userId = userId;
    this.state.opened = true;
  }

  close() {
    this.state.userId = null;
    this.state.opened = false;
  }

  async submit(data: UserFormData) {
    if (this.mode === 'create') {
      const success = await this.usersDataStore.create(data);
      success && this.close();
    } else {
      // this.usersDataStore.update(data);
    }
  }
}

interface State {
  userId: User['id'] | null;
  opened: boolean;
}

export interface UserFormData extends Omit<User, 'id' | '__typename'> {}
