import { makeAutoObservable } from 'mobx';
import { inject } from 'react-ioc';
import { UserDetailsLocationStore } from '@/app/users/_common/navigation/users.paths';
import { UserDetailsDataStore } from '@/app/users/_common/stores/user-details.data-store';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';

export class UserDetailsViewStore {
  private readonly locationStore = inject(this, UserDetailsLocationStore);
  private readonly usersDataStore = inject(this, UsersDataStore);
  private readonly userDetailsDataStore = inject(this, UserDetailsDataStore);

  private state = {
    auditTrailVisible: true,
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get usersLoading() {
    return this.usersDataStore.loading;
  }

  get detailsLoading() {
    return this.userDetailsDataStore.loading;
  }

  get usersError() {
    return this.usersDataStore.error;
  }

  get detailsError() {
    return this.userDetailsDataStore.error;
  }

  get userId() {
    return this.locationStore.params.id;
  }

  get user() {
    return this.usersDataStore.findUserById(this.userId);
  }

  get auditTrail() {
    return this.userDetailsDataStore.userDetails?.auditTrail || [];
  }

  get auditTrailVisible() {
    return this.state.auditTrailVisible;
  }

  toggleAuditTrailVisible() {
    this.state.auditTrailVisible = !this.state.auditTrailVisible;
  }

  refresh() {
    this.userDetailsDataStore.refresh();
  }
}
