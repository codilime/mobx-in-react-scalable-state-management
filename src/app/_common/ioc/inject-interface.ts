import { inject } from 'react-ioc';
import { Class } from 'type-fest';

/**
 * react-ioc inject(...) with improved typing for Classes and tokens
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function injectInterface<T>(target: any, classOrInjectionToken: Class<T>): T {
  return inject(target, classOrInjectionToken);
}
