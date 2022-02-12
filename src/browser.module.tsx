import React from 'react';
import { provider } from 'react-ioc';
import { ThemeDataStore } from '@/app/_common/stores/theme.data-store';
import { Theme } from '@/app/_common/components/theme/theme';
import { AppToast } from '@/app/_components/app-toast/app-toast';
import { AppToastViewStore } from '@/app/_common/stores/app-toast.view-store';
import { AppModule } from '@/app/app.module';
import { GraphqlClient } from '@/app/_common/graphql/graphql-client';

export const BrowserModule = provider(
  ThemeDataStore,
  AppToastViewStore,
  GraphqlClient,
)(() => (
  <Theme>
    <AppModule />
    <AppToast />
  </Theme>
));
