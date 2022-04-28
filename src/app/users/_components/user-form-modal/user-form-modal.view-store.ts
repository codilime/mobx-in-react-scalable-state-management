import { inject } from 'react-ioc';
import { makeAutoObservable } from 'mobx';
import { User } from '@/generated/graphql';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';
import { omit } from 'lodash';
import { ModalState } from '@/app/_common/components/modal/modal.state';

export class UserFormModalViewStore {
  private usersDataStore = inject(this, UsersDataStore);

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

  private get user() {
    if (this.modalState.data?.mode === 'edit') {
      return this.usersDataStore.findUserById(this.modalState.data.userId);
    } else {
      return null;
    }
  }

  async submit(data: UserFormData) {
    let success = false;
    switch (this.modalState.data?.mode) {
      case 'create':
        success = await this.usersDataStore.create(data);
        break;
      case 'edit':
        success = await this.usersDataStore.update({
          id: this.modalState.data.userId,
          ...data,
        });
    }
    success && this.modalState.close();
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
