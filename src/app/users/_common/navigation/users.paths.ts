import { RootPaths } from '@/app/_common/navigation/root-paths';
import { pathResolver } from '@/app/_common/navigation/path-resolver';
import { createInjectionToken } from '@/app/_common/ioc/injection-token';
import { LocationStore } from '@/app/_common/stores/location.store';

export enum UsersPath {
  MAIN = '',
  DETAILS = '/:id',
}

type PathMain = {
  path: UsersPath.MAIN;
};

type PathDetails = {
  path: UsersPath.DETAILS;
  params: { id: string };
};

type Paths = PathMain | PathDetails;

export const toUsersPath = pathResolver<Paths>(RootPaths.USERS);

export const UserDetailsLocationStore = createInjectionToken<LocationStore<PathDetails>>('UserDetailsLocationStore');
