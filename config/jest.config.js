// const babelConfig = require('./babel.config.js')
const paths = require('./paths')

module.exports = {
  rootDir: paths.rootPath,
  transform: {
    '/\\.(js|jsx)$/': '<rootDir>/config/jest/transformer.js'
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
    'react-app-polyfill/jsdom'
  ],
  setupTestFrameworkScriptFile: '<rootDir>/src/setupTests.js',
  testPathIgnorePatterns: [
    '<rootDir>[/\\\\](build|docs|node_modules|scripts|es5)[/\\\\]'
  ],
  moduleDirectories: [
    'node_modules',
    'src'
  ],
  snapshotSerializers: [
    'enzyme-to-json/serializer'
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
  ]
}
