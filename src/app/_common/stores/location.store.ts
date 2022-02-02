import qs from 'qs';
import { useCallback, useEffect, useRef } from 'react';
import { makeAutoObservable } from 'mobx';
import { useLocation, useParams } from 'react-router-dom';

export class LocationStore<PROPS extends LocationProps = AnyObject> {
  private state: State<PROPS> = {
    params: {},
    pathname: '',
    search: '',
    hash: '',
  };

  constructor() {
    makeAutoObservable(this, undefined, { autoBind: true });
  }

  setState({ hash, params, pathname, search }: State) {
    this.state.params = params as PROPS['params'];
    this.state.pathname = pathname;
    this.state.search = search;
    this.state.hash = hash;
  }

  get params(): PROPS['params'] {
    return this.state.params;
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
  const params = useParams();
  const firstTime = useRef(true);

  const sync = useCallback(() => {
    store.setState({ params, pathname, search, hash });
  }, [hash, pathname, params, search, store]);

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

interface State<PROPS extends LocationProps = AnyObject> {
  params: PROPS['params'];
  pathname: string;
  search: string;
  hash: string;
}

type AnyObject = Record<string, unknown>;
