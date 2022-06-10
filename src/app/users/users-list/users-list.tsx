import { observer } from 'mobx-react-lite';
import { provider, useInstance } from 'react-ioc';
import { DataGrid } from '@mui/x-data-grid';
import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import { UsersListViewStore } from '@/app/users/users-list/users-list.view-store';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { toUsersPath, UsersPath } from '../_common/navigation/users.paths';
import { UserJTO } from '@/app/users/_common/remote-api/jto/users.jto';

const columns = [
  { field: 'firstName', headerName: 'First name', width: 150 },
  { field: 'lastName', headerName: 'Last name', width: 150 },
  { field: 'email', headerName: 'Email', flex: 1 },
  {
    field: 'id',
    headerName: '',
    renderCell: ({ value }: { value: UserJTO['id'] }) => (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <Button
          variant="outlined"
          href={toUsersPath({
            path: UsersPath.DETAILS,
            params: { id: value },
          })}
        >
          Details
        </Button>
      </Box>
    ),
  },
];

export const UsersList = provider(
  UsersListViewStore,
  //
)(
  observer(() => {
    const store = useInstance(UsersListViewStore);

    return (
      <PageLayout title="Users">
        <Box sx={{ display: 'flex', alignItems: 'center', padding: 1, gap: 1 }}>
          <Button variant="contained" onClick={store.refresh}>
            Refresh
          </Button>
          {store.error}
        </Box>

        <DataGrid
          rows={store.users}
          columns={columns}
          disableSelectionOnClick
          autoHeight
          loading={store.loading}
        />
      </PageLayout>
    );
  }),
);
