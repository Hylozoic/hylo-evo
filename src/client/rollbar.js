const { ROLLBAR_CLIENT_TOKEN, NODE_ENV, ROLLBAR_ENV } = process.env

const rollbar = (() => {
  if (typeof window === 'undefined' || !ROLLBAR_CLIENT_TOKEN) {
    return {
      configure: () => {}
    }
  }

  const Rollbar = require('rollbar/dist/rollbar.umd')
  return new Rollbar({
    accessToken: `${ROLLBAR_CLIENT_TOKEN}`,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: `${ROLLBAR_ENV || NODE_ENV}`
    }
  })
})()

export default rollbar
