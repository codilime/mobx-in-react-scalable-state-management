import { RootPaths } from '@/app/_common/navigation/root-paths';
import { pathResolver } from '@/app/_common/navigation/path-resolver';

export enum DashboardPath {
  MAIN = '',
}

export const toDashboardPath = pathResolver<Paths>(RootPaths.DASHBOARD);

type PathMain = {
  path: DashboardPath.MAIN;
};

type Paths = PathMain;
