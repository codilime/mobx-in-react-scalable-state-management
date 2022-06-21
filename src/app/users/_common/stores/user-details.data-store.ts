import {
  makeAutoObservable,
  onBecomeObserved,
  onBecomeUnobserved,
  runInAction,
} from 'mobx';
import { inject } from 'react-ioc';
import { UserDetailsLocationStore } from '@/app/users/_common/navigation/users.paths';
import { GetUserDetailsResponseJTO } from '@/app/users/_common/remote-api/jto/users.jto';
import { UsersHttpService } from '@/app/users/_common/remote-api/users.http-service';
import {
  delay,
  from,
  ObservableInput,
  Subscription,
  switchMap,
  timer,
} from 'rxjs';
import { toStream } from 'mobx-utils';
import { retry, tap } from 'rxjs/operators';

export class UserDetailsDataStore {
  private readonly locationStore = inject(this, UserDetailsLocationStore);
  private readonly usersHttpService = inject(this, UsersHttpService);

  private state: State = {
    loading: false,
    error: '',
    response: null,
    refreshTrigger: false,
  };
  private subscription$?: Subscription;
  private sub1?: () => void;
  private sub2?: () => void;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });

    this.sub1 = onBecomeObserved(this.state, 'response', () => {
      this.subscription$ = this.setupRead();
    });

    this.sub2 = onBecomeUnobserved(this.state, 'response', () => {
      this.subscription$?.unsubscribe();
    });
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
    this.state.refreshTrigger = !this.state.refreshTrigger;
  }

  dispose() {
    this.subscription$?.unsubscribe();
    this.sub1?.();
    this.sub2?.();
  }

  private setupRead() {
    const fireImmediately = true;
    return from(
      toStream(
        () => [this.locationStore.params.id, this.state.refreshTrigger],
        fireImmediately,
      ) as ObservableInput<[typeof this.locationStore.params.id, boolean]>,
    )
      .pipe(
        tap(() => {
          runInAction(() => {
            this.state.loading = true;
            this.state.error = '';
          });
        }),
        switchMap(([request]) =>
          this.usersHttpService.getUserDetails$(request),
        ),
        tap((response) => {
          runInAction(() => {
            this.state.response = response;
            this.state.loading = false;
          });
        }),
        retry({
          delay: (error, retryCount) => {
            runInAction(() => {
              this.state.error = 'Network problem... Retrying...' + retryCount;
            });
            return timer(Math.min(1000 * retryCount, 5000));
          },
        }),
        delay(3000),
        tap(() => this.refresh()),
      )
      .subscribe();
  }
}

interface State {
  loading: boolean;
  error: string;
  response: GetUserDetailsResponseJTO | null;
  refreshTrigger: boolean;
}
