type ValueOf<T> = T[keyof T];

export const DEFAULT_COLUMN_NAME = Object.freeze({
  code: 'code'
});

export type Column = {
  [key: string]: string;
};
