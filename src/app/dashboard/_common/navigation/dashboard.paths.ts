import { RootPaths } from '@/app/_common/navigation/root-paths';
import { pathResolver } from '@/app/_common/navigation/path-resolver';

export enum DashboardPath {
  MAIN = '',
}

type PathMain = {
  path: DashboardPath.MAIN;
};

type Paths = PathMain;

export const toDashboardPath = pathResolver<Paths>(RootPaths.DASHBOARD);
