import mixpanel from 'mixpanel-browser'
import config, { isProduction, isTest } from 'config/index'

if (!isTest) {
  mixpanel.init(config.mixpanel.token, { debug: !isProduction })
}

export default (state = mixpanel, action) => state
