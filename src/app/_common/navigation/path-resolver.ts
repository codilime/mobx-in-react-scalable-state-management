import qs from 'qs';
import { generatePath } from 'react-router-dom';
import { LocationProps } from '@/app/_common/stores/location.store';

export const pathResolver = <ROUTE_PROPS_MAPPING extends RouteProps>(parentPath: string = '') => {
  return ({ path, params, search, hash }: { path: ROUTE_PROPS_MAPPING['path'] } & Partial<ROUTE_PROPS_MAPPING>) => {
    const generatedPath = params ? generatePath(path || '', params) : path;
    const searchString = search ? qs.stringify(search, { addQueryPrefix: true }) : '';
    const hashString = hash ? '#' + qs.stringify(hash) : '';
    return `${parentPath}${generatedPath}${searchString}${hashString}`;
  };
};

interface RouteProps extends LocationProps {
  path: string;
}
