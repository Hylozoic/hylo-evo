import config, { isProduction } from 'config'

const appId = isProduction ? config.intercom.appId : config.intercom.debugAppId

if (!window.Intercom) {
  (function (w, d, id, s, x) {
    function i () {
      i.c(arguments)
    }
    i.q = []
    i.c = function (args) {
      i.q.push(args)
    }
    w.Intercom = i
    s = d.createElement('script')
    s.async = 1
    s.src = 'https://widget.intercom.io/widget/' + id
    d.head.appendChild(s)
  })(window, document, appId)
}

const IntercomAPI = (...args) => {
  window.Intercom.apply(null, args)
}

IntercomAPI('boot', {app_id: appId})

export default (state = IntercomAPI, action) => state
