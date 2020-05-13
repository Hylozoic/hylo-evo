// NOTE: This is linked in jest config under "setupFiles"
// This is ran before every test file before the test environment is setup.

global.graphql = jest.fn()

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn()
};

global.navigator.geolocation = mockGeolocation;