import qs from 'qs';
import { generatePath } from 'react-router-dom';

export enum UsersPath {
  MAIN = '/users',
}

interface UsersPathParams {
  path: UsersPath;
  params?: Record<string, unknown>;
  search?: Record<string, unknown>;
  hash?: Record<string, unknown>;
}

export function toUsersPath({ path, params, search, hash }: UsersPathParams) {
  const generatedPath = params ? generatePath(path, params) : path;
  const searchString = search ? qs.stringify(search, { addQueryPrefix: true }) : '';
  const hashString = hash ? '#' + qs.stringify(hash) : '';
  return `${generatedPath}${searchString}${hashString}`;
}
