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
import { Subscription } from 'rxjs';
import { subscribeAsyncReader } from '@/app/_common/stores/subscribe-async-reader';

export class UsersDataStore {
  private usersHttpService = inject(this, UsersHttpService);

  private readSubscription$?: Subscription;

  private readRequest = false;

  private state: State = {
    entities: new Map(),
    asyncRead: new AsyncState(),
    asyncCreate: new AsyncState(),
    asyncUpdate: new AsyncState(),
    asyncDelete: new AsyncState(),
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.afterCreate();
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

  refresh() {
    this.readRequest = !this.readRequest;
  }

  private afterCreate() {
    this.readSubscription$ = subscribeAsyncReader({
      asyncState: this.state.asyncRead,
      request: () => this.readRequest,
      read: () => this.usersHttpService.getUsers$(),
      onSuccess: (response) => {
        this.state.entities.clear();
        response.forEach((item) => this.state.entities.set(item.id, item));
      },
    });
  }

  dispose() {
    this.readSubscription$?.unsubscribe();
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
