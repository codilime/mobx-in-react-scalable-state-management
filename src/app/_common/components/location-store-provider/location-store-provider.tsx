import React from 'react';
import { provider, useInstance } from 'react-ioc';
import { observer } from 'mobx-react-lite';
import { InjectionToken } from '@/app/_common/ioc/injection-token';
import {
  LocationStore,
  useSyncLocationStore,
} from '@/app/_common/stores/location.store';

export function withLocationStoreProviderHOC(
  locationStoreToken: InjectionToken<LocationStore>,
  Component: React.ComponentType,
) {
  return provider(
    [locationStoreToken, LocationStore], // provide LocationStore by InjectionToken
    //
  )(
    observer(() => {
      const locationStore = useInstance(locationStoreToken);
      useSyncLocationStore(locationStore); // sync LocationStore using useLocation() and useRouteMatch()
      return <Component />;
    }),
  );
}
