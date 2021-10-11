import { provider } from 'react-ioc';
import { observer } from 'mobx-react-lite';
import { RootModule } from '@/app/root-module';
import { UsersDataStore } from '@/app/users/_common/stores/users.data-store';
import { UsersPage } from '@/app/users/_components/users-page/users-page';
import { Route, Switch } from 'react-router-dom';
import { toUsersPath } from './_common/navigation/users.paths';

// We want this store to be globally accessible. Even when we leave /users path and come back - this is store will survice
RootModule.register(UsersDataStore);

const UsersModule = provider()(
  //
  // Services provided here will be visible only in UsersModule children (deeply)
  //
  observer(() => {
    return (
      <Switch>
        <Route key={toUsersPath()} exact component={UsersPage} />
      </Switch>
    );
  }),
);

export default UsersModule;
