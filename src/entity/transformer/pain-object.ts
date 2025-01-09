/* eslint-disable @typescript-eslint/no-unsafe-function-type */

export type Properties<T> = {
  [K in keyof T]: T[K] extends Function ? never : T[K];
};
