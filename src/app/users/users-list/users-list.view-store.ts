import { makeAutoObservable, toJS } from 'mobx';
import { inject } from 'react-ioc';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';

export class UsersListViewStore {
  private usersDataStore = inject(this, UsersDataStore);

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get users() {
    return toJS(this.usersDataStore.users);
  }

  get loading() {
    return this.usersDataStore.loading;
  }

  get error() {
    return this.usersDataStore.error;
  }

  refresh() {
    this.usersDataStore.refresh();
  }
}
