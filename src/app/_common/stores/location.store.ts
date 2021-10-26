import qs from 'qs';
import { useCallback, useEffect, useRef } from 'react';
import { makeAutoObservable } from 'mobx';
import { matchPath, useLocation, useRouteMatch } from 'react-router-dom';

export class LocationStore<PROPS extends LocationProps = AnyObject> {
  private state: State = {
    path: '',
    pathname: '',
    search: '',
    hash: '',
    isExact: true,
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
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

/**
 * Seamless synchronization of useLocation() and useRouteMatch() with LocationStore state
 */
export const useSyncLocationStore = (store: LocationStore) => {
  const { pathname, search, hash } = useLocation();
  const { path, isExact } = useRouteMatch();
  const firstTime = useRef(true);

  const sync = useCallback(() => {
    store.setState({ path, pathname, search, hash, isExact });
  }, [hash, isExact, path, pathname, search, store]);

  useEffect(() => {
    if (!firstTime.current) {
      sync();
    }
  }, [sync]);

  if (firstTime.current) {
    sync();
    firstTime.current = false;
  }
};

export interface LocationProps {
  params?: AnyObject;
  hash?: AnyObject;
  search?: AnyObject;
}

interface State {
  path: string;
  pathname: string;
  search: string;
  hash: string;
  isExact: boolean;
}

type AnyObject = Record<string, unknown>;
