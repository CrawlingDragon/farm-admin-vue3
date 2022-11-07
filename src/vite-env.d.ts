/// <reference types="vite/client" />

import { start } from 'repl';

declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module 'nprogress' {
  function start(): any;
  function done(): any;
}

declare module 'ali-oss';
