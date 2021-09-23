module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'jsdom',
    transform: {
      "^.+\\.tsx?$": "ts-jest"
    },
    roots: ['<rootDir>/src/__tests__'],
    testMatch: ['<rootDir>/src/**/__tests__/**/*.{ts,tsx,mjs}'], // finds test
    moduleFileExtensions: ['ts', 'tsx', 'json', 'node','js'],
    testPathIgnorePatterns: ['/node_modules/', '/public/'],
    setupFilesAfterEnv: [
      ]
  };