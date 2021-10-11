import { lazy, Suspense } from 'react';
import { provider } from 'react-ioc';
import { Theme } from './common/components/theme/theme.component';
import { ThemeDataStore } from './common/stores/theme.data-store';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

const Dashboard = lazy(() => import('./features/dashboard/dashboard'));

export const App = provider(
  ThemeDataStore,
  //
)(() => {
  return (
    <Theme>
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/" component={Dashboard} />
          </Switch>
        </Suspense>
      </Router>
    </Theme>
  );
});
