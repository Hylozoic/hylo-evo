import Rollbar from 'rollbar/dist/rollbar.umd.js'

const { ROLLBAR_CLIENT_TOKEN, NODE_ENV } = process.env

var rollbarConfig = {
  accessToken: `${ROLLBAR_CLIENT_TOKEN}`,
  captureUncaught: true,
  payload: {
    environment: `${NODE_ENV}`
  }
}

export default new Rollbar(rollbarConfig)
