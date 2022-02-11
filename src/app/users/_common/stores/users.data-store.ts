import { inject } from 'react-ioc';
import { makeAutoObservable, runInAction } from 'mobx';
import { UsersHttpService } from '@/app/users/_common/remote-api/users.http-service';
import {
  DeleteUsersRequestJTO,
  GetUsersResponseJTO,
  PostUserRequestJTO,
} from '@/app/users/_common/remote-api/jto/users.jto';

export class UsersDataStore {
  private usersHttpService = inject(this, UsersHttpService);

  private state: State = {
    data: [] as GetUsersResponseJTO,
    loading: false,
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.read(); // fetch data once the UsersDataStore has been created
  }

  get users() {
    return this.state.data;
  }

  get loading() {
    return this.state.loading;
  }

  get error() {
    return this.state.error;
  }

  findUserById(userId: User['id']) {
    return this.users?.find((user) => user.id === userId) || null;
  }

  async read() {
    this.state.loading = true;
    try {
      const response = await this.usersHttpService.getUsers();
      runInAction(() => {
        this.state.data = response;
        this.state.error = undefined;
      });
    } catch (e) {
      runInAction(() => {
        this.state.error = 'Connection error';
      });
    }
    this.state.loading = false;
  }

  async create(user: PostUserRequestJTO) {
    this.state.loading = true;
    try {
      const response = await this.usersHttpService.postUser(user);
      runInAction(() => {
        this.state.data.push(response);
        this.state.error = undefined;
      });
      return true;
    } catch (e) {
      runInAction(() => {
        this.state.error = 'Connection error';
      });
    }
    this.state.loading = false;
    return false;
  }

  async delete(request: DeleteUsersRequestJTO) {
    this.state.loading = true;
    try {
      await this.usersHttpService.deleteUsers(request);
      runInAction(() => {
        this.state.data = this.state.data.filter((u) => request.ids.includes(u.id));
        this.state.error = undefined;
      });
      return true;
    } catch (e) {
      runInAction(() => {
        this.state.error = 'Connection error';
      });
    }
    this.state.loading = false;
  }
}

type State = {
  data: GetUsersResponseJTO;
  loading: boolean;
  error?: string;
};
