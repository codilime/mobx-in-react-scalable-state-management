import { isNil } from 'lodash';

export function assertNotNil(value: unknown): asserts value {
  if (isNil(value)) {
    throw new Error('Unexpected nil value');
  }
}
