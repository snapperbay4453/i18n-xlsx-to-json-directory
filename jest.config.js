export default {
  testMatch: [
    "**/__tests__/**/*.+(ts|tsx|js)",
    "**/?(*.)+(spec|test).+(ts|tsx|js)"
  ],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest"
  },
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
    '#/(.*)$': '<rootDir>/tests/$1',
  },
};
