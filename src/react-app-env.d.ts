/// <reference types="react-scripts" />

import { Class } from 'type-fest';
import * as reactIoc from 'react-ioc';

declare module 'react-ioc' {
  function inject<T>(target: any, clazz: Class<T>): T; // Fix for WebStorm bug

  export default {
    ...reactIoc,
    inject,
  };
}
