import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import {
  toUsersPath,
  UsersPath,
} from '@/app/users/_common/navigation/users.paths';
import { provider, useInstance } from 'react-ioc';
import { UserDetailsViewStore } from '@/app/users/user-details/user-details.view-store';
import { UserFormModalViewStore } from '@/app/users/_components/user-form-modal/user-form-modal.view-store';
import Button from '@mui/material/Button';
import { useCallback } from 'react';

export const UserDetails = provider(
  UserDetailsViewStore,
  //
)(
  observer(() => {
    const store = useInstance(UserDetailsViewStore);
    const { modalState } = useInstance(UserFormModalViewStore);

    const editUser = useCallback(
      () => modalState.open({ mode: 'edit', userId: store.userId }),
      [modalState, store],
    );

    return (
      <PageLayout title={`User details: ` + store.userId}>
        <Button onClick={editUser} variant="contained">
          Edit
        </Button>
        <Link
          to={toUsersPath({ path: UsersPath.DETAILS, params: { id: '2' } })}
        >
          Go to user with ID 2
        </Link>
      </PageLayout>
    );
  }),
);
