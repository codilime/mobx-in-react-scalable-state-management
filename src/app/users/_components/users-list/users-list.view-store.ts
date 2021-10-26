import { makeAutoObservable } from 'mobx';
import { injectInterface } from '@/app/_common/ioc/inject-interface';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';
import { CreateUserMutationVariables } from '@/generated/graphql';
import { AppToastViewStore } from '@/app/_common/stores/app-toast.view-store';
import { GridSelectionModel } from '@mui/x-data-grid';

export class UsersListViewStore {
  private usersDataStore = injectInterface(this, UsersDataStore);
  private appToastViewStore = injectInterface(this, AppToastViewStore);

  private state: State = {
    selectionModel: [],
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get selectionModel() {
    return this.state.selectionModel;
  }

  get users() {
    return [...(this.usersDataStore.users || [])];
  }

  setSelectionModel(selectionModel: State['selectionModel']) {
    this.state.selectionModel = selectionModel;
  }

  refresh() {
    this.usersDataStore.read();
  }

  async create(user: CreateUserMutationVariables) {
    const success = await this.usersDataStore.create(user);
    if (success) {
      this.appToastViewStore.open('User has been created', 'success');
    } else {
      this.appToastViewStore.open('User creation failed. Please try again.', 'error');
    }
    return success;
  }

  async delete() {
    const success = await this.usersDataStore.delete({ ids: this.selectionModel.map((id) => id.toString()) });
    if (success) {
      this.appToastViewStore.open('Users have been deleted', 'success');
    } else {
      this.appToastViewStore.open('Users deletion failed', 'error');
    }
    return success;
  }
}

interface State {
  selectionModel: GridSelectionModel;
}

export type UserRow = UsersListViewStore['users'][0];
