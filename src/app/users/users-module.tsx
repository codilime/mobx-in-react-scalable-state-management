import { observer } from 'mobx-react-lite';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';
import { UsersList } from '@/app/users/_components/users-list/users-list';
import { Route, Switch } from 'react-router-dom';
import { toUsersPath, UserDetailsLocationStore, UsersPath } from './_common/navigation/users.paths';
import { UserDetails } from '@/app/users/details/user-details';
import { withLocationStoreProviderHOC } from '@/app/_common/components/location-store-provider/location-store-provider';
import { provider } from 'react-ioc';

// If we want this store to survive even when we leave `/users` path and come back - then we should register it in AppModule
// AppModule.register(UsersDataStore);

// Convenient way to provide MobX *LocationStore with useSyncLocationStore() for component which depends on *LocationStore
const UserDetailsWithLocation = withLocationStoreProviderHOC(UserDetailsLocationStore, UserDetails);

const UsersModule = provider(
  UsersDataStore,
  //
)(
  observer(() => {
    return (
      <Switch>
        <Route key="1" path={toUsersPath({ path: UsersPath.MAIN })} exact component={UsersList} />
        <Route key="2" path={toUsersPath({ path: UsersPath.DETAILS })} exact component={UserDetailsWithLocation} />
      </Switch>
    );
  }),
);

export default UsersModule;
