import { provider } from 'react-ioc';
import { ThemeDataStore } from './common/stores/theme.data-store';

export const AppProviders = provider(
  ThemeDataStore,
  //
);
