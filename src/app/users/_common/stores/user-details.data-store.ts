import { makeAutoObservable, onBecomeObserved } from 'mobx';
import { inject } from 'react-ioc';
import { UserDetailsLocationStore } from '@/app/users/_common/navigation/users.paths';
import { AsyncState } from '@/app/_common/stores/async.state';
import { GetUserDetailsResponseJTO } from '@/app/users/_common/remote-api/jto/users.jto';
import { Subscription } from 'rxjs';
import { subscribeAsyncReader } from '@/app/_common/stores/subscribe-async-reader';
import { UsersHttpService } from '@/app/users/_common/remote-api/users.http-service';

export class UserDetailsDataStore {
  private readonly locationStore = inject(this, UserDetailsLocationStore);
  private readonly usersHttpService = inject(this, UsersHttpService);

  private state: State = {
    asyncRead: new AsyncState(),
    response: null,
  };

  private readSubscription$?: Subscription;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.afterCreate();
  }

  get asyncRead() {
    return this.state.asyncRead;
  }

  get userDetails() {
    return this.state.response;
  }

  private afterCreate() {
    const stopObserving = onBecomeObserved(this.state, 'response', () => {
      stopObserving(); // only once

      this.readSubscription$ = subscribeAsyncReader({
        asyncState: this.state.asyncRead,
        request: () => this.locationStore.params.id,
        read: (userId) => this.usersHttpService.getUserDetails$(userId),
        onSuccess: (response) => (this.state.response = response),
      });
    });
  }

  dispose() {
    this.readSubscription$?.unsubscribe();
  }
}

interface State {
  asyncRead: AsyncState;
  response: GetUserDetailsResponseJTO | null;
}
