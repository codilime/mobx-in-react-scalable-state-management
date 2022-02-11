import { autorun, makeAutoObservable } from 'mobx';
import { inject } from 'react-ioc';
import { UserDetailsLocationStore } from '@/app/users/_common/navigation/users.paths';

export class UserDetailsViewStore {
  private readonly locationStore = inject(this, UserDetailsLocationStore);
  private readonly autorunDisposer?: ReturnType<typeof autorun>;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.autorunDisposer = autorun(() => {
      // eslint-disable-next-line no-console
      console.log(`Query graphql for details of ${this.userId}...`);
    });
  }

  get userId() {
    return this.locationStore.params.id;
  }

  dispose() {
    this.autorunDisposer?.();
  }
}
