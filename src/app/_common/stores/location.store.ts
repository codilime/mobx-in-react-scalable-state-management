import qs from 'qs';
import { useInstance } from 'react-ioc';
import { action, makeObservable, observable } from 'mobx';
import { matchPath, useLocation, useRouteMatch } from 'react-router-dom';
import { InjectionToken } from '@/app/_common/ioc/injection-token';

export class LocationStore<PROPS extends LocationProps = {}> {
  private state: State = {
    path: '',
    pathname: '',
    search: '',
    hash: '',
    isExact: true,
  };

  constructor() {
    makeObservable(this, {
      // @ts-ignore
      state: observable,
      setState: action,
    });
  }

  setState({ hash, path, pathname, search }: State) {
    this.state.path = path;
    this.state.pathname = pathname;
    this.state.search = search;
    this.state.hash = hash;
  }

  get params(): PROPS['params'] {
    return matchPath(this.state.pathname, {
      path: this.state.path,
      exact: this.state.isExact,
    })?.params as PROPS['params'];
  }

  get search(): PROPS['search'] {
    return qs.parse(this.state.search || '', { ignoreQueryPrefix: true }) as PROPS['search'];
  }

  get hash(): PROPS['hash'] {
    return qs.parse((this.state.hash || '').replace(/^#/, '')) as PROPS['hash'];
  }
}

export const useSyncLocationStore = (locationStoreToken: InjectionToken<LocationStore<LocationProps>>) => {
  const store = useInstance(locationStoreToken);
  const { pathname, search, hash } = useLocation();
  const { path, isExact } = useRouteMatch();
  store.setState({ path, pathname, search, hash, isExact });
};

export interface LocationProps {
  params?: {};
  hash?: {};
  search?: {};
}

interface State {
  path: string;
  pathname: string;
  search: string;
  hash: string;
  isExact: boolean;
}
