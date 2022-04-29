import { get, isArray, isString } from 'lodash';

const ERROR_PATHS = [
  'message',
  'data.message',
  'data.error',
  'response.data',
  'response.data.message',
];

export const getErrorMessage = (error: unknown): string => {
  if (isString(error)) return error;

  const errorPath = ERROR_PATHS.find(
    (path) => isString(get(error, path)) || isArray(get(error, path)),
  );
  return errorPath ? '' + get(error, errorPath) : '';
};
