import React, { lazy, Suspense } from 'react';
import { provider } from 'react-ioc';
import { GraphqlClient } from '@/app/_common/graphql/graphql-client';
import { ThemeDataStore } from '@/app/_common/stores/theme.data-store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { RootPaths } from '@/app/_common/navigation/root-paths';
import { Theme } from '@/app/_common/components/theme/theme';

const DashboardModule = lazy(() => import('./dashboard/dashboard-module'));
const UsersModule = lazy(() => import('./users/users-module'));

// When we want to register services from descendant modules in RootModule - it must be a class :(
class RootModuleComponent extends React.Component {
  render() {
    return (
      <Theme>
        <Router>
          <Suspense fallback={<div>Loading...</div>}>
            <Switch>
              <Route key="users" exact path={RootPaths.USERS} component={UsersModule} />
              <Route key="dashboards" path={RootPaths.DASHBOARD} component={DashboardModule} />
            </Switch>
          </Suspense>
        </Router>
      </Theme>
    );
  }
}

export const RootModule = provider(
  GraphqlClient,
  ThemeDataStore,
  //
)(RootModuleComponent);
