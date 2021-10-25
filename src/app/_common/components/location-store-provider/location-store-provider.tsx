import React from 'react';
import { provider } from 'react-ioc';
import { observer } from 'mobx-react-lite';
import { InjectionToken } from '@/app/_common/ioc/injection-token';
import { LocationStore, useSyncLocationStore } from '@/app/_common/stores/location.store';

export function locationStoreProviderHOC(
  locationStoreInjectionToken: InjectionToken<LocationStore>,
  Component: React.ComponentType,
) {
  return provider(
    [locationStoreInjectionToken, LocationStore], // provide LocationStore by InjectionToken
    //
  )(
    observer(() => {
      useSyncLocationStore(locationStoreInjectionToken); // sync LocationStore using useLocation() and useRouteMatch()
      return <Component />;
    }),
  );
}
