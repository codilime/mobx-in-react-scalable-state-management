import { observer } from 'mobx-react-lite';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';
import { UsersList } from '@/app/users/users-list/users-list';
import { Route, Routes } from 'react-router-dom';
import { UserDetailsLocationStore, UsersPath } from './_common/navigation/users.paths';
import { UserDetails } from '@/app/users/user-details/user-details';
import { withLocationStoreProviderHOC } from '@/app/_common/components/location-store-provider/location-store-provider';
import { provider } from 'react-ioc';
import { UserModal } from '@/app/users/_components/user-modal/user-modal';
import { UserModalViewStore } from '@/app/users/_components/user-modal/user-modal.view-store';
import { AppModule } from '@/app/app-module';
import { UsersHttpService } from '@/app/users/_common/remote-api/users.http-service';

// We use AppModule.register(...) here to use tree shaking (code splitting) for any src/app/users/**.* files
AppModule.register(UsersHttpService);
AppModule.register(UsersDataStore);

// Convenient way to provide MobX *LocationStore with useSyncLocationStore() for component which depends on *LocationStore
const UserDetailsWithLocation = withLocationStoreProviderHOC(UserDetailsLocationStore, UserDetails);

const UsersModule = provider(
  UserModalViewStore,
  //
)(
  observer(() => {
    return (
      <>
        <Routes>
          <Route path={UsersPath.MAIN} element={<UsersList />} />
          <Route path={UsersPath.DETAILS} element={<UserDetailsWithLocation />} />
        </Routes>

        <UserModal />
      </>
    );
  }),
);

export default UsersModule;
