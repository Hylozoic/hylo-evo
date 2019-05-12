process.env.NODE_ENV = 'test'
process.env.PUBLIC_URL = ''

// Load environment variables from .env file. Suppress warnings using silent
// if this file is missing. dotenv will never modify any environment variables
// that have already been set.
// https://github.com/motdotla/dotenv
require('dotenv').config({ silent: true })

const jest = require('jest')
const argv = process.argv.slice(2)

// * Because console.log will get seen in the display without this:
//   https://github.com/facebook/jest/issues/2441
//   Note: Alternatively could use `--runInBand` to always run tests in serial
argv.push('--verbose=false')

// Custom config file location
if (argv.indexOf('--config') < 0) {
  argv.push('--config', 'config/jest.config.js')
}

// Watch unless on CI or in coverage mode
if (!process.env.CI && argv.indexOf('--coverage') < 0) {
  argv.push('--watch')
}

// Disable cache if it's causing problems (will make Jest much slower).
// argv.push('--no-cache')

jest.run(argv)
