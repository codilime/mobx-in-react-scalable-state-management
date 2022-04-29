import { inject } from 'react-ioc';
import { makeAutoObservable } from 'mobx';
import { User } from '@/generated/graphql';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';
import { omit } from 'lodash';
import { ModalState } from '@/app/_common/components/modal/modal.state';
import { AsyncState } from '@/app/_common/stores/async.state';
import { AppToastViewStore } from '@/app/_common/stores/app-toast.view-store';

export class UserFormModalViewStore {
  private usersDataStore = inject(this, UsersDataStore);
  private appToastViewStore = inject(this, AppToastViewStore);

  private state = {
    modal: new ModalState<ModalData>(),
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get modalState() {
    return this.state.modal;
  }

  get title() {
    return this.modalState.data?.mode === 'create'
      ? 'Add new user'
      : 'Edit ' + this.user?.email;
  }

  get defaultValues(): UserFormData {
    if (this.modalState.data?.mode === 'edit' && this.user) {
      return omit(this.user, 'id', '__typename');
    } else {
      return { firstName: '', lastName: '', email: '' };
    }
  }

  get asyncState() {
    return this.modalState.data?.mode === 'create'
      ? this.usersDataStore.asyncCreate
      : this.usersDataStore.asyncUpdate;
  }

  private get user() {
    if (this.modalState.data?.mode === 'edit') {
      return this.usersDataStore.findUserById(this.modalState.data.userId);
    } else {
      return null;
    }
  }

  async submit(data: UserFormData) {
    let asyncState: AsyncState | null = null;
    switch (this.modalState.data?.mode) {
      case 'create':
        asyncState = await this.usersDataStore.create(data);
        break;
      case 'edit':
        asyncState = await this.usersDataStore.update({
          id: this.modalState.data.userId,
          ...data,
        });
    }
    if (asyncState?.isResolved) {
      const message =
        this.modalState.data?.mode === 'create' ? 'added' : 'updated';
      this.appToastViewStore.open(`User has been successfully ${message}`);
      this.modalState.close();
    } else {
      this.appToastViewStore.open(
        'User operation failed: ' + asyncState?.errorMessage,
        'error',
      );
    }
  }
}

interface ModalDataCreate {
  mode: 'create';
  userId?: undefined;
}

interface ModalDataEdit {
  mode: 'edit';
  userId: User['id'];
}

type ModalData = ModalDataCreate | ModalDataEdit;

export interface UserFormData extends Omit<User, 'id' | '__typename'> {}
