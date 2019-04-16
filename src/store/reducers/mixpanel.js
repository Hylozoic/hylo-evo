import mixpanel from 'mixpanel-browser'
import config, { isProduction } from 'config'

mixpanel.init(config.mixpanel.token, { debug: !isProduction })

export default (state = mixpanel, action) => state
