import { useCallback } from 'react';
import Button from '@mui/material/Button';
import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import { observer } from 'mobx-react-lite';
import { useInstance } from 'react-ioc';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';

export const UsersPage = observer(() => {
  const store = useInstance(UsersDataStore);

  const addNewUser = useCallback(
    () =>
      store.create({
        firstName: 'Micheal',
        lastName: 'Jackson',
        email: 'michael.jackson@foo.local',
      }),
    [store],
  );

  return (
    <PageLayout title="Users">
      <Button onClick={addNewUser}>Add new user</Button>
      <pre>{JSON.stringify(store.users, undefined, 2)}</pre>
    </PageLayout>
  );
});
