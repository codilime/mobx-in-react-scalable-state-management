import { inject } from 'react-ioc';
import { Class } from 'type-fest';

/**
 * react-ioc inject(...)with improved typing for Classes
 */
// eslint-disable-next-line
export function injectClass<T>(target: any, clazz: Class<T>): T {
  return inject(target, clazz);
}
