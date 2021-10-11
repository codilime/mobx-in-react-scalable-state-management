import { RootPaths } from '@/app/_common/navigation/root-paths';
import { pathResolver } from '@/app/_common/navigation/path-resolver';

export enum UsersPath {
  MAIN = '',
}

export const toUsersPath = pathResolver<UsersPath>(RootPaths.USERS);
