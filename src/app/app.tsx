import { AppProviders } from './app.providers';
import { Dashboard } from './features/dashboard/dashboard';
import { Theme } from './common/components/theme/theme.component';

export const App = AppProviders(() => {
  return (
    <Theme>
      <Dashboard />
    </Theme>
  );
});
