import { PageLayout } from '@/app/_common/components/page-layout/page-layout';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { toUsersPath, UserDetailsLocationStore, UsersPath } from '@/app/users/_common/navigation/users.paths';
import { useInstance } from 'react-ioc';

export const UserDetails = observer(() => {
  const { params } = useInstance(UserDetailsLocationStore);
  return (
    <PageLayout title={`User details: ` + params.id}>
      <Link to={toUsersPath({ path: UsersPath.DETAILS, params: { id: '2' } })}>Go to user with ID 2</Link>
    </PageLayout>
  );
});
