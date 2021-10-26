import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { toUsersPath, UsersPath } from '@/app/users/_common/navigation/users.paths';
import { provider, useInstance } from 'react-ioc';
import { UserDetailsViewStore } from '@/app/users/details/user-details.view-store';

export const UserDetails = provider(
  UserDetailsViewStore,
  //
)(
  observer(() => {
    const store = useInstance(UserDetailsViewStore);
    return (
      <PageLayout title={`User details: ` + store.userId}>
        <Link to={toUsersPath({ path: UsersPath.DETAILS, params: { id: '2' } })}>Go to user with ID 2</Link>
      </PageLayout>
    );
  }),
);
