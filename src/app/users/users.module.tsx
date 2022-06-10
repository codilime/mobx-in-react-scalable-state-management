import { observer } from 'mobx-react-lite';
import { UsersList } from '@/app/users/users-list/users-list';
import { Route, Routes } from 'react-router-dom';
import {
  UserDetailsLocationStore,
  UsersPath,
} from './_common/navigation/users.paths';
import { UserDetails } from '@/app/users/user-details/user-details';
import { withLocationStoreProviderHOC } from '@/app/_common/components/location-store-provider/location-store-provider';
import { provider } from 'react-ioc';
import { AppModule } from '@/app/app.module';
import { UsersHttpService } from '@/app/users/_common/remote-api/users.http-service';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';

// We use AppModule.register(...) here to use tree shaking (code splitting)
// for any src/app/users/**.* files

AppModule.register(UsersHttpService);
// AppModule.register(UsersDataStore);

// Convenient way to provide MobX *LocationStore with useSyncLocationStore() for component which depends on *LocationStore
const UserDetailsWithLocation = withLocationStoreProviderHOC(
  UserDetailsLocationStore,
  UserDetails,
);

const UsersModule = provider(
  UsersDataStore,
  //
)(
  observer(() => {
    return (
      <>
        <Routes>
          <Route path={UsersPath.MAIN} element={<UsersList />} />
          <Route
            path={UsersPath.DETAILS}
            element={<UserDetailsWithLocation />}
          />
        </Routes>
      </>
    );
  }),
);

export default UsersModule;
