const paths = require('./paths')

module.exports = {
  rootDir: paths.rootPath,
  timers: 'modern',
  transform: {
    '\\.(gql|graphql)$': 'jest-transform-graphql',
    '^.+\\.jsx?$': '<rootDir>/config/jest/transformer.js'
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{js,jsx}'
  ],
  coverageReporters: [
    'json',
    'lcov'
  ],
  resolver: 'jest-pnp-resolver',
  setupFiles: [
    'react-app-polyfill/jsdom',
    '<rootDir>/config/jest/beforeTestEnvSetup.js'
  ],
  setupFilesAfterEnv: [
    '<rootDir>/config/jest/afterTestEnvSetup.js'
  ],
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](build|docs|node_modules|scripts|es5)[/\\\\]'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer',
    'jest-serializer-graphql'
  ],
  testEnvironment: 'jsdom',
  testURL: 'http://localhost',
  moduleNameMapper: {
    '^react-native$': 'react-native-web',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': '<rootDir>/config/jest/__mocks__/fileMock.js',
    '\\.(css|less|scss)$': '<rootDir>/config/jest/__mocks__/styleMock.js'
  },
  watchPlugins: [
    'jest-watch-typeahead/filename',
    'jest-watch-typeahead/testname'
  ],
  // * Because console.log will get munched in test display with `verbose: true`:
  //   https://github.com/facebook/jest/issues/2441
  //   Note: Alternatively could use `--runInBand` to always run tests in serial
  verbose: false
}
