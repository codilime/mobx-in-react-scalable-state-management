import React, { lazy, Suspense } from 'react';
import { provider } from 'react-ioc';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { FullPageFallbackProgress } from '@/app/_common/components/full-page-fallback-progress/full-page-fallback-progress';

const DashboardModule = lazy(() => import('./dashboard/dashboard.module'));
const UsersModule = lazy(() => import('./users/users.module'));

export const AppModule = provider()(() => {
  return (
    <Router>
      <Suspense fallback={<FullPageFallbackProgress />}>
        <Routes>
          <Route path="/users/*" element={<UsersModule />} />
          <Route path="/*" element={<DashboardModule />} />
        </Routes>
      </Suspense>
    </Router>
  );
});
