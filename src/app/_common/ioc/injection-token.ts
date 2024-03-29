import { Class } from 'type-fest';

const ALL_TOKENS: Record<string, boolean> = {};

export type InjectionToken<T> = Class<T>;

export function createInjectionToken<T>(tokenName: string): Class<T> {
  if (!tokenName) {
    throw new Error('Please provide token name for easier debug.');
  }
  if (ALL_TOKENS[tokenName]) {
    throw new Error(
      `Token with name ${tokenName} has been already created. Please use unique names.`,
    );
  }
  ALL_TOKENS[tokenName] = true;
  // @ts-ignore
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const token = (): T => {}; // token must be a function to proper working of `inject(this, TOKEN)` (react-ioc limitation)
  token.displayName = tokenName;
  // @ts-ignore
  return token;
}
