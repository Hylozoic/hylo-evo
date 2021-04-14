export const PROJECT_CONTRIBUTIONS = 'PROJECT_CONTRIBUTIONS'
export const INLINE_COMMENTS = 'INLINE_COMMENTS'

const featureFlag = key => process.env['FEATURE_FLAG_' + key]

export default featureFlag
