export enum RootPaths {
  DASHBOARD = '/',
  USERS = '/users',
}

export function moduleRootPath(rootPath: RootPaths) {
  return rootPath + '/*';
}
