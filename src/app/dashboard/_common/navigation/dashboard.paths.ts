import qs from 'qs';
import { generatePath } from 'react-router-dom';

export enum DashboardPath {
  MAIN = '/',
}

interface DashboardPathParams {
  path: DashboardPath;
  params?: Record<string, unknown>;
  search?: Record<string, unknown>;
  hash?: Record<string, unknown>;
}

export function toDashboardPath({ path, params, search, hash }: DashboardPathParams) {
  const generatedPath = params ? generatePath(path, params) : path;
  const searchString = search ? qs.stringify(search, { addQueryPrefix: true }) : '';
  const hashString = hash ? '#' + qs.stringify(hash) : '';
  return `${generatedPath}${searchString}${hashString}`;
}
