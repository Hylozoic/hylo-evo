export const PROJECT_CONTRIBUTIONS = 'PROJECT_CONTRIBUTIONS'

const featureFlags = {
  [PROJECT_CONTRIBUTIONS]: process.env['FEATURE_FLAG_' + PROJECT_CONTRIBUTIONS]
}

export default featureFlags
