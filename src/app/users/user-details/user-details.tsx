import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import {
  toUsersPath,
  UsersPath,
} from '@/app/users/_common/navigation/users.paths';
import { provider, useInstance } from 'react-ioc';
import { UserDetailsViewStore } from '@/app/users/user-details/user-details.view-store';
import { UserModalViewStore } from '@/app/users/_components/user-modal/user-modal.view-store';
import { Button } from '@material-ui/core';

export const UserDetails = provider(
  UserDetailsViewStore,
  //
)(
  observer(() => {
    const store = useInstance(UserDetailsViewStore);
    const modalStore = useInstance(UserModalViewStore);

    const editUser = () => modalStore.open(store.userId);

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
