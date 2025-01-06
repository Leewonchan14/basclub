export type Properties<T> = {
  [K in keyof T]: T[K] extends Function ? never : K;
};
