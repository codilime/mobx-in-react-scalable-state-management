import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { provider, useInstance } from 'react-ioc';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import {
  UserRow,
  UsersListViewStore,
} from '@/app/users/users-list/users-list.view-store';
import {
  toUsersPath,
  UsersPath,
} from '@/app/users/_common/navigation/users.paths';
import { UserFormModalViewStore } from '@/app/users/_components/user-form-modal/user-form-modal.view-store';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { DeleteItemsModal } from '@/app/_common/components/delete-items-modal/delete-items-modal';

export const UsersList = provider(
  UsersListViewStore,
  //
)(
  observer(() => {
    const store = useInstance(UsersListViewStore);
    const { modalState } = useInstance(UserFormModalViewStore);

    const addNewUser = useCallback(async () => {
      modalState.open({ mode: 'create' });
    }, [modalState]);

    const refresh = useCallback(() => store.refresh(), [store]);

    return (
      <PageLayout title="Users">
        <Box sx={{ display: 'flex', padding: 1 }} style={{ gap: 20 }}>
          <Button variant="contained" onClick={addNewUser}>
            Add new user
          </Button>
          <Button
            variant="contained"
            onClick={store.openDeleteItemsModal}
            disabled={store.selectionModel.length === 0}
          >
            Delete
          </Button>
          <Button variant="contained" onClick={refresh}>
            Refresh
          </Button>
        </Box>

        <DataGrid
          checkboxSelection
          selectionModel={store.selectionModel}
          onSelectionModelChange={store.setSelectionModel}
          rows={store.users}
          columns={columns}
          disableSelectionOnClick
          autoHeight
        />
        <DeleteItemsModal
          state={store.deleteItemsModal}
          onAccept={store.delete}
          pending={store.loading}
        />
      </PageLayout>
    );
  }),
);

const columns: GridColDef[] = [
  {
    field: 'firstName',
    headerName: 'First name',
    width: 150,
  },
  {
    field: 'lastName',
    headerName: 'Last name',
    width: 150,
  },
  {
    field: 'email',
    headerName: 'Email',
    width: 200,
    renderCell: ({ row, value }) => (
      <Link
        to={toUsersPath({
          path: UsersPath.DETAILS,
          params: { id: (row as UserRow).id },
        })}
      >
        {value}
      </Link>
    ),
  },
];
