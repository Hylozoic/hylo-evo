import mixpanel from 'mixpanel-browser'

mixpanel.init(process.env.MIXPANEL_TOKEN)

export default (state = mixpanel, action) => state
