export type FixedLengthArray<T, L extends number> = {
  0: T;
  length: L;
} & ReadonlyArray<T>;
