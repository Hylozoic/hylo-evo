import Rollbar from 'rollbar/dist/rollbar.umd'
const { ROLLBAR_CLIENT_TOKEN, NODE_ENV, ROLLBAR_ENV } = process.env

var rollbarConfig = {
  accessToken: `${ROLLBAR_CLIENT_TOKEN}`,
  captureUncaught: true,
  captureUnhandledRejections: true,
  payload: {
    environment: `${ROLLBAR_ENV || NODE_ENV}`
  }
}

export default new Rollbar(rollbarConfig)
