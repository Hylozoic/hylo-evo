import { get } from 'lodash/fp'
import qs from 'querystring'
import { LOGIN } from 'store/constants'

export default function loginWithService (name) {
  return {
    type: LOGIN,
    payload: authWithService(name)
  }
}

export function authWithService (service) {
  return new Promise((resolve, reject) => {
    try {
      const popup = openPopup(service)
      const timeout = setTimeout(() => {
        reject(new Error('The request timed out; please try again.'))
      }, 30000)

      // the name 'popupDone' is important, because code in the popup (which is
      // set up by hylo-node) will call this callback with that name
      window.popupDone = function ({ context, error, provider }) {
        if (context !== authContext) return
        clearTimeout(timeout)
        popup.close()
        if (error) return reject(new Error(error))
        resolve()
      }
    } catch (err) {
      reject(err)
    }
  })
}

// this key can be any value; it is just used to ensure that the message we get
// back from the popup is the one that we expect
const authContext = 'login'

// this is a singleton
let messageEventListener

function openPopup (service) {
  setupMessageEventListener()

  const { clientWidth, clientHeight } = document.documentElement
  const [width, height] = {
    google: [420, 480],
    facebook: [560, 520]
  }[service]

  // n.b.: positioning of the popup will be off on Chrome on OSX, possibly
  // others, if you're using multiple displays
  const left = clientWidth / 2 - width / 2
  const top = clientHeight / 2 - height / 2

  const params = {
    returnDomain: window.location.origin,
    authContext
  }

  return window.open(
    `/noo/login/${service}?${qs.stringify(params)}`,
    `${service}Auth`,
    `width=${width}, height=${height}, left=${left}, top=${top}, titlebar=no, toolbar=no, menubar=no`
  )
}

// depending on the browser's age and security policy, calling `popupDone`
// directly may not work. here, we fall back to the `postMessage()` API:
// https://developer.mozilla.org/en-US/docs/Web/API/Window/postMessage
function setupMessageEventListener () {
  if (messageEventListener) return
  messageEventListener = window.addEventListener('message', ({ data }) => {
    if (get('type', data) === 'third party auth') window.popupDone(data)
  })
}
