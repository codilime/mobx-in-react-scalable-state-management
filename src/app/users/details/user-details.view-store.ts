import { injectClass } from '@/app/_common/ioc/inject-class';
import { UserDetailsLocationStore } from '@/app/users/_common/navigation/users.paths';
import { autorun, makeAutoObservable } from 'mobx';

export class UserDetailsViewStore {
  private readonly location = injectClass(this, UserDetailsLocationStore);
  private readonly autorunDisposer?: ReturnType<typeof autorun>;

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
    this.autorunDisposer = autorun(() => {
      console.log(`Query graphql for details of ${this.userId}...`);
    });
  }

  get userId() {
    return this.location.params.id;
  }

  dispose() {
    this.autorunDisposer?.();
  }
}
