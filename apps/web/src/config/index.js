import { once } from 'lodash'

export const environment = import.meta.env.NODE_ENV || 'development'
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

export const filestackKey = import.meta.env.VITE_FILESTACK_API_KEY
export const logLevel = import.meta.env.VITE_LOG_LEVEL
export const socketHost = import.meta.env.VITE_SOCKET_HOST
export const host = import.meta.env.VITE_HOST
export const slack = {
  clientId: import.meta.env.VITE_SLACK_APP_CLIENT_ID
}
export const s3 = {
  bucket: import.meta.env.VITE_AWS_S3_BUCKET,
  host: import.meta.env.VITE_AWS_S3_HOST
}
export const google = {
  key: import.meta.env.VITE_GOOGLE_BROWSER_KEY,
  clientId: import.meta.env.VITE_GOOGLE_CLIENT_ID
}
export const segment = {
  writeKey: import.meta.env.VITE_SEGMENT_KEY
}
export const intercom = {
  appId: import.meta.env.VITE_INTERCOM_APP_ID
}
export const mixpanel = {
  token: import.meta.env.VITE_MIXPANEL_TOKEN
}
export const mapbox = {
  token: import.meta.env.VITE_MAPBOX_TOKEN
}

export const featureFlags = () => {
  if (isServer) {
    return once(() =>
      Object.keys(import.meta.env).reduce((flags, key) => {
        if (key.startsWith('VITE_FEATURE_FLAG_')) {
          flags[key.replace('VITE_FEATURE_FLAG_', '')] = import.meta.env[key]
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
