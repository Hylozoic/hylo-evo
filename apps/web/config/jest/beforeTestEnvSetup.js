// NOTE: This is linked in jest config under "setupFiles"
// This is ran before every test file before the test environment is setup.

global.IS_REACT_ACT_ENVIRONMENT = true

global.graphql = jest.fn()

const mockGeolocation = {
  getCurrentPosition: jest.fn(),
  watchPosition: jest.fn()
}

global.navigator.geolocation = mockGeolocation

jest.mock('react-tsparticles', () => () => 'ParticlesComponent')

window.Intl = {
  DateTimeFormat: jest.fn().mockImplementation(() => ({
    resolvedOptions: jest.fn().mockImplementation(() => ({
      timeZone: 'Etc/GMT'
    }))
  }))
}

window.matchMedia = jest.fn().mockImplementation(query => {
  return {
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }
})
