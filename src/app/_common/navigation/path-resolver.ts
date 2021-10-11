import qs from 'qs';
import { generatePath } from 'react-router-dom';

export const pathResolver = <PATH_ENUM>(parentPath: string = '') => {
  return ({ path = '', params, search, hash }: RoutePathParams<PATH_ENUM> = {}) => {
    // @ts-ignore
    const generatedPath = params ? generatePath(path, params) : path;
    const searchString = search ? qs.stringify(search, { addQueryPrefix: true }) : '';
    const hashString = hash ? '#' + qs.stringify(hash) : '';
    return `${parentPath}${generatedPath}${searchString}${hashString}`;
  };
};

interface RoutePathParams<PATH_ENUM> {
  path?: PATH_ENUM | '';
  params?: Record<string, string>;
  search?: Record<string, unknown>;
  hash?: Record<string, unknown>;
}
