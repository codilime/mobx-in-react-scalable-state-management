import { useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { provider, useInstance } from 'react-ioc';
import Button from '@mui/material/Button';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import { UserRow, UsersListViewStore } from '@/app/users/_components/users-list/users-list.view-store';
import { toUsersPath, UsersPath } from '@/app/users/_common/navigation/users.paths';

export const UsersList = provider(
  UsersListViewStore,
  //
)(
  observer(() => {
    const store = useInstance(UsersListViewStore);

    const addNewUser = useCallback(async () => {
      const success = await store.create({
        firstName: 'Micheal',
        lastName: 'Jackson',
        email: 'michael.jackson@foo.local',
      });
      if (success) {
        // history.push(to new user details?)
      }
    }, [store]);

    const refresh = useCallback(() => store.refresh(), [store]);

    return (
      <PageLayout title="Users">
        <Button variant="contained" onClick={addNewUser}>
          Add new user
        </Button>
        <Button variant="contained" onClick={store.delete} disabled={store.selectionModel.length === 0}>
          Delete
        </Button>
        <Button variant="contained" onClick={refresh}>
          Refresh
        </Button>
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
      <Link to={toUsersPath({ path: UsersPath.DETAILS, params: { id: (row as UserRow).id } })}>{value}</Link>
    ),
  },
];
