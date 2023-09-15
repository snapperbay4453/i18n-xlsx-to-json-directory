type ValueOf<T> = T[keyof T];

export const LANGUAGE_CODE = Object.freeze({
  english: 'en',
  korean: 'ko',
});

export const COLUMN_NAME = Object.freeze({
  code: 'code',
  ...LANGUAGE_CODE,
});

export type ColumnKey = ValueOf<typeof COLUMN_NAME>;
export type Column = {
  [key in ColumnKey]: string;
};
