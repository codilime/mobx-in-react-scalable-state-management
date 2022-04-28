import { makeAutoObservable } from 'mobx';
import { inject } from 'react-ioc';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';
import { CreateUserMutationVariables, User } from '@/generated/graphql';
import { AppToastViewStore } from '@/app/_common/stores/app-toast.view-store';
import { ModalState } from '@/app/_common/components/modal/modal.state';
import { DeleteItemsModalData } from '@/app/_common/components/delete-items-modal/delete-items-modal';
import { assertNotNil } from '@/app/_common/utils/assert-not-nil';
import { GridSelectionModel } from '@mui/x-data-grid';

export class UsersListViewStore {
  private usersDataStore = inject(this, UsersDataStore);
  private appToastViewStore = inject(this, AppToastViewStore);

  private state: State = {
    selectionModel: [],
    deleteItemsModal: new ModalState<DeleteItemsModalData>(),
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  get selectionModel() {
    return this.state.selectionModel;
  }

  get deleteItemsModal() {
    return this.state.deleteItemsModal;
  }

  get users() {
    return [...(this.usersDataStore.users || [])];
  }

  get loading() {
    return this.usersDataStore.loading;
  }

  setSelectionModel(
    selectionModel: State['selectionModel'] | GridSelectionModel,
  ) {
    this.state.selectionModel = selectionModel as State['selectionModel'];
  }

  refresh() {
    this.usersDataStore.read();
  }

  async create(user: CreateUserMutationVariables) {
    const success = await this.usersDataStore.create(user);
    if (success) {
      this.appToastViewStore.open('User has been created', 'success');
    } else {
      this.appToastViewStore.open(
        'User creation failed. Please try again.',
        'error',
      );
    }
    return success;
  }

  openDeleteItemsModal() {
    this.state.deleteItemsModal.open({
      items: this.selectionModel.map((id) => {
        const user = this.usersDataStore.findUserById(id);
        assertNotNil(user);
        return { id: user.id, label: `${user.firstName} ${user.lastName}` };
      }),
    });
  }

  async delete(ids: Array<User['id']>) {
    const success = await this.usersDataStore.delete({ ids });
    if (success) {
      this.appToastViewStore.open('Users have been deleted', 'success');
      this.state.deleteItemsModal.close();
      this.state.selectionModel = [];
    } else {
      this.appToastViewStore.open('Users deletion failed', 'error');
    }
    return success;
  }
}

interface State {
  selectionModel: string[];
  deleteItemsModal: ModalState<DeleteItemsModalData>;
}

export type UserRow = UsersListViewStore['users'][0];
