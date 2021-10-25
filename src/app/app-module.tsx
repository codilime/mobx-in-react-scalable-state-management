import React, { lazy, Suspense } from 'react';
import { provider } from 'react-ioc';
import { GraphqlClient } from '@/app/_common/graphql/graphql-client';
import { ThemeDataStore } from '@/app/_common/stores/theme.data-store';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { RootPaths } from '@/app/_common/navigation/root-paths';
import { Theme } from '@/app/_common/components/theme/theme';
import { AppToast } from '@/app/_components/app-toast/app-toast';
import { AppToastViewStore } from '@/app/_common/stores/app-toast.view-store';

const DashboardModule = lazy(() => import('./dashboard/dashboard-module'));
const UsersModule = lazy(() => import('./users/users-module'));

export const AppModule = provider(
  GraphqlClient,
  ThemeDataStore,
  AppToastViewStore,
  //
)(
  // When we want to register services from descendant modules in RootModule - it must be a class :(
  class AppModuleComponent extends React.Component {
    render() {
      return (
        <Theme>
          <Router>
            <Suspense fallback={<div>Loading...</div>}>
              <Switch>
                <Route key="users" path={RootPaths.USERS} component={UsersModule} />
                <Route key="dashboards" path={RootPaths.DASHBOARD} component={DashboardModule} />
              </Switch>
            </Suspense>
          </Router>
          <AppToast />
        </Theme>
      );
    }
  },
);
