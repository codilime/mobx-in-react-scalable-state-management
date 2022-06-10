import { makeAutoObservable, runInAction } from 'mobx';
import { inject } from 'react-ioc';
import { UserDetailsLocationStore } from '@/app/users/_common/navigation/users.paths';
import { GetUserDetailsResponseJTO } from '@/app/users/_common/remote-api/jto/users.jto';
import { UsersHttpService } from '@/app/users/_common/remote-api/users.http-service';

export class UserDetailsDataStore {
  private readonly locationStore = inject(this, UserDetailsLocationStore);
  private readonly usersHttpService = inject(this, UsersHttpService);

  private state: State = {
    loading: false,
    error: '',
    response: null,
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.read();
  }

  get loading() {
    return this.state.loading;
  }

  get error() {
    return this.state.error;
  }

  get userDetails() {
    return this.state.response;
  }

  refresh() {
    this.read();
  }

  private async read() {
    this.state.response = null;
    this.state.loading = true;
    this.state.error = '';

    try {
      const response = await this.usersHttpService.getUserDetails(
        this.locationStore.params.id,
      );
      runInAction(() => {
        this.state.response = response;
        this.state.loading = false;
      });
    } catch (e) {
      runInAction(() => {
        this.state.error = 'Connection problem...';
        this.state.loading = false;
      });
    }
  }
}

interface State {
  loading: boolean;
  error: string;
  response: GetUserDetailsResponseJTO | null;
}
