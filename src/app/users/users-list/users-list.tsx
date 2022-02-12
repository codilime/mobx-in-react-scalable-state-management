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
import { UserModalViewStore } from '@/app/users/_components/user-modal/user-modal.view-store';
import { Box, Button } from '@material-ui/core';

export const UsersList = provider(
  UsersListViewStore,
  //
)(
  observer(() => {
    const store = useInstance(UsersListViewStore);
    const userModalViewStore = useInstance(UserModalViewStore);

    const addNewUser = useCallback(async () => {
      userModalViewStore.open();
    }, [userModalViewStore]);

    const refresh = useCallback(() => store.refresh(), [store]);

    return (
      <PageLayout title="Users">
        <Box sx={{ display: 'flex', padding: 10 }} style={{ gap: 20 }}>
          <Button variant="contained" onClick={addNewUser}>
            Add new user
          </Button>
          <Button
            variant="contained"
            onClick={store.delete}
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
