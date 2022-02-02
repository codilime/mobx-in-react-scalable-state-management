import React, { lazy, Suspense } from 'react';
import { provider } from 'react-ioc';
import { GraphqlClient } from '@/app/_common/graphql/graphql-client';
import { ThemeDataStore } from '@/app/_common/stores/theme.data-store';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { moduleRootPath, RootPaths } from '@/app/_common/navigation/root-paths';
import { Theme } from '@/app/_common/components/theme/theme';
import { AppToast } from '@/app/_components/app-toast/app-toast';
import { AppToastViewStore } from '@/app/_common/stores/app-toast.view-store';
import { FullPageFallbackProgress } from '@/app/_common/components/full-page-fallback-progress/full-page-fallback-progress';

const DashboardModule = lazy(() => import('./dashboard/dashboard-module'));
const UsersModule = lazy(() => import('./users/users-module'));

export const AppModule = provider(
  GraphqlClient,
  ThemeDataStore,
  AppToastViewStore,
)(
  // When we want to register services from descendant modules in RootModule - it must be a class (react-ioc limitation)
  class AppModuleComponent extends React.Component {
    render() {
      return (
        <Theme>
          <Router>
            <Suspense fallback={<FullPageFallbackProgress />}>
              <Routes>
                <Route path={moduleRootPath(RootPaths.USERS)} element={<UsersModule />} />
                <Route path={moduleRootPath(RootPaths.DASHBOARD)} element={<DashboardModule />} />
              </Routes>
            </Suspense>
          </Router>
          <AppToast />
        </Theme>
      );
    }
  },
);
