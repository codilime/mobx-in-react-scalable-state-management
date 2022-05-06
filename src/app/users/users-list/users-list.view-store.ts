import { makeAutoObservable, toJS } from 'mobx';
import { inject } from 'react-ioc';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';
import { User } from '@/generated/graphql';
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
    return toJS(this.usersDataStore.users);
  }

  get asyncRead() {
    return this.usersDataStore.asyncRead;
  }

  get asyncDelete() {
    return this.usersDataStore.asyncDelete;
  }

  setSelectionModel(
    selectionModel: State['selectionModel'] | GridSelectionModel,
  ) {
    this.state.selectionModel = selectionModel as State['selectionModel'];
  }

  refresh() {
    this.usersDataStore.refresh();
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
    const { isResolved, errorMessage } = await this.usersDataStore.delete({
      ids,
    });
    if (isResolved) {
      this.appToastViewStore.open('Users have been deleted', 'success');
      this.state.deleteItemsModal.close();
      this.state.selectionModel = [];
    } else {
      this.appToastViewStore.open(
        'Users deletion failed: ' + errorMessage,
        'error',
      );
    }
  }
}

interface State {
  selectionModel: string[];
  deleteItemsModal: ModalState<DeleteItemsModalData>;
}

export type UserRow = UsersListViewStore['users'][0];
