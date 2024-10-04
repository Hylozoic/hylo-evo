const { ROLLBAR_CLIENT_TOKEN, ROLLBAR_ENV, NODE_ENV } = process.env

function getBundleVersion () {
  if (NODE_ENV === 'development') return 'dev'
  if (NODE_ENV === 'test') return 'test'

  try {
    let scripts = document.querySelectorAll('script')
    scripts = Array.prototype.slice.call(scripts)
    const pattern = /main\.(\w+)\.js/
    const bundleSrc = scripts.find(x => x.src.match(pattern)).src
    return bundleSrc.match(pattern)[1]
  } catch (err) {
    console.error("couldn't figure out bundle version")
    return 'unknown'
  }
}

const rollbar = (() => {
  if (typeof window === 'undefined' || !ROLLBAR_CLIENT_TOKEN) {
    return {
      configure: () => {},
      error: console.error.bind(console),
      disabled: true
    }
  }

  const Rollbar = require('rollbar/dist/rollbar.umd')
  return new Rollbar({
    accessToken: `${ROLLBAR_CLIENT_TOKEN}`,
    captureUncaught: true,
    captureUnhandledRejections: true,
    payload: {
      environment: `${ROLLBAR_ENV || NODE_ENV}`,
      client: {
        javascript: {
          source_map_enabled: true,
          guess_uncaught_frames: true,
          code_version: getBundleVersion()
        }
      }
    }
  })
})()

export default rollbar
