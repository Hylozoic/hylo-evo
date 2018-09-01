import mixpanel from 'mixpanel-browser'
import config from '../../config'

mixpanel.init(config.mixpanel.token)

export default (state = mixpanel, action) => state
