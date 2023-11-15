import { once } from 'lodash'

export const environment = process.env.NODE_ENV || 'development'
export const isTest = environment === 'test'
export const isDev = environment === 'development'
export const isProduction = environment === 'production'

const isServer = typeof window === 'undefined'

// FIXME: The following is from hylo-redux used for SSR only
//        but our create-react-app heritages manages
//        the loading of .env in the relevant scripts (build and start)
// if (isServer && environment === 'development') {
//   require('dotenv').load({silent: true})
// }

export const filestackKey = process.env.FILESTACK_API_KEY || process.env.FILEPICKER_API_KEY
export const logLevel = process.env.LOG_LEVEL
export const socketHost = process.env.SOCKET_HOST
export const host = process.env.HOST
export const slack = {
  clientId: process.env.SLACK_APP_CLIENT_ID
}
export const s3 = {
  bucket: process.env.AWS_S3_BUCKET,
  host: process.env.AWS_S3_HOST
}
export const google = {
  key: process.env.GOOGLE_BROWSER_KEY,
  clientId: process.env.GOOGLE_CLIENT_ID
}
export const segment = {
  writeKey: process.env.SEGMENT_KEY
}
export const intercom = {
  appId: process.env.INTERCOM_APP_ID
}
export const mixpanel = {
  token: process.env.MIXPANEL_TOKEN
}
export const mapbox = {
  token: process.env.MAPBOX_TOKEN
}

export const featureFlags = () => {
  if (isServer) {
    return once(() =>
      Object.keys(process.env).reduce((flags, key) => {
        if (key.startsWith('FEATURE_FLAG_')) {
          flags[key.replace('FEATURE_FLAG_', '')] = process.env[key]
        }
        return flags
      }, {}))()
  } else {
    return window.FEATURE_FLAGS || {}
  }
}

const config = {
  environment,
  filestackKey,
  logLevel,
  host,
  slack,
  s3,
  google,
  segment,
  featureFlags,
  intercom,
  mixpanel,
  mapbox
}

if (!isServer) window.__appConfig = config

export default config
