
export const PROJECT_CONTRIBUTIONS = 'PROJECT_CONTRIBUTIONS'
export const EVENTS = 'EVENTS'

const featureFlag = key => process.env['FEATURE_FLAG_' + key]

export default featureFlag