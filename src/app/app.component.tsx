import { AppProviders } from './app.providers';
import { Dashboard } from './features/dashboard/dashboard.component';
import { ThemeProvider } from './common/components/theme-provider/theme-provider.component';

export const App = AppProviders(() => {
  return (
    <ThemeProvider>
      <Dashboard />
    </ThemeProvider>
  );
});
