import { inject } from 'react-ioc';
import { makeAutoObservable, runInAction } from 'mobx';
import { UsersHttpService } from '@/app/users/_common/remote-api/users.http-service';
import {
  GetUsersResponseJTO,
  UserJTO,
} from '@/app/users/_common/remote-api/jto/users.jto';

export class UsersDataStore {
  private usersHttpService = inject(this, UsersHttpService);

  private state: State = {
    response: [],
    loading: false,
    error: undefined,
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.read();
  }

  get users() {
    return this.state.response;
  }

  get loading() {
    return this.state.loading;
  }

  get error() {
    return this.state.error;
  }

  findUserById(userId: UserJTO['id']) {
    return this.state.response.find((user) => user.id === userId);
  }

  refresh() {
    this.read();
  }

  private async read() {
    this.state.loading = true;
    try {
      const response = await this.usersHttpService.getUsers();
      runInAction(() => {
        this.state.response = response;
        this.state.error = undefined;
        this.state.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.state.error = 'Connection error';
        this.state.loading = false;
      });
    }
  }
}

type State = {
  response: GetUsersResponseJTO;
  loading: boolean;
  error: string | undefined;
};
