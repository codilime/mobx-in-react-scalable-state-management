import { inject } from 'react-ioc';
import { makeAutoObservable, runInAction } from 'mobx';
import { User } from '@/generated/graphql';
import { AsyncState } from '@/app/_common/stores/async.state';
import { UsersHttpService } from '@/app/users/_common/remote-api/users.http-service';
import {
  DeleteUsersRequestJTO,
  PostUserRequestJTO,
  PutUserRequestJTO,
  UserJTO,
} from '@/app/users/_common/remote-api/jto/users.jto';

export class UsersDataStore {
  private usersHttpService = inject(this, UsersHttpService);

  private state: State = {
    entities: new Map(),
    asyncRead: new AsyncState(),
    asyncCreate: new AsyncState(),
    asyncUpdate: new AsyncState(),
    asyncDelete: new AsyncState(),
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.read(); // fetch data once the UsersDataStore has been created
  }

  get asyncRead() {
    return this.state.asyncRead;
  }

  get asyncCreate() {
    return this.state.asyncCreate;
  }

  get asyncUpdate() {
    return this.state.asyncUpdate;
  }

  get asyncDelete() {
    return this.state.asyncDelete;
  }

  get users() {
    return Array.from(this.state.entities.values());
  }

  findUserById(userId: User['id']) {
    return this.state.entities.get(userId);
  }

  async read() {
    const asyncState = this.state.asyncRead;
    asyncState.invoke();
    try {
      const response = await this.usersHttpService.getUsers();
      runInAction(() => {
        this.state.entities.clear();
        response.forEach((item) => this.state.entities.set(item.id, item));
        asyncState.resolve();
      });
    } catch (e) {
      runInAction(() => {
        asyncState.reject(e);
      });
    }
  }

  async create(user: PostUserRequestJTO) {
    const asyncState = this.state.asyncCreate;
    asyncState.invoke();
    try {
      const response = await this.usersHttpService.postUser(user);
      runInAction(() => {
        this.state.entities.set(response.id, response);
        asyncState.resolve();
      });
    } catch (e) {
      runInAction(() => {
        asyncState.reject(e);
      });
    }
    return asyncState;
  }

  async update(user: PutUserRequestJTO) {
    const asyncState = this.state.asyncUpdate;
    asyncState.invoke();
    try {
      const response = await this.usersHttpService.putUser(user);
      runInAction(() => {
        this.state.entities.set(response.id, response);
        asyncState.resolve();
      });
    } catch (e) {
      runInAction(() => {
        asyncState.reject(e);
      });
    }
    return asyncState;
  }

  async delete(request: DeleteUsersRequestJTO) {
    const asyncState = this.state.asyncDelete;
    asyncState.invoke();
    try {
      await this.usersHttpService.deleteUsers(request);
      runInAction(() => {
        request.ids.forEach((id) => this.state.entities.delete(id));
        asyncState.resolve();
      });
    } catch (e) {
      runInAction(() => {
        asyncState.reject(e);
      });
    }
    return asyncState;
  }
}

type State = {
  entities: Map<UserJTO['id'], UserJTO>;
  asyncRead: AsyncState;
  asyncCreate: AsyncState;
  asyncUpdate: AsyncState;
  asyncDelete: AsyncState;
};
