import orm from 'store/models'

describe('hasFeature', () => {
  var oldTesterIds, currentUser
  const testerId = '123'
  const nonTesterId = '456'

  beforeAll(() => {
    oldTesterIds = process.env.HYLO_TESTER_IDS
    process.env.HYLO_TESTER_IDS = testerId + ',888,999'
    const session = orm.session(orm.getEmptyState())
    const { Me } = session
    currentUser = Me.create({
      id: testerId
    })
  })

  afterAll(() => {
    process.env.HYLO_TESTER_IDS = oldTesterIds
  })

  it('returns false on "off"', () => {
    const featureName = 'TEST_FEATURE_1'
    const flagName = 'FEATURE_FLAG_' + featureName
    process.env[flagName] = 'off'
    expect(currentUser.hasFeature(featureName)).toBeFalsy()
  })

  it('returns true on "on"', () => {
    const featureName = 'TEST_FEATURE_2'
    const flagName = 'FEATURE_FLAG_' + featureName
    process.env[flagName] = 'on'
    expect(currentUser.hasFeature(featureName)).toBeTruthy()
  })

  it('returns false on "testing" with a non tester', () => {
    const featureName = 'TEST_FEATURE_3'
    const flagName = 'FEATURE_FLAG_' + featureName
    process.env[flagName] = 'testing'
    expect(currentUser.hasFeature(featureName)).toBeTruthy()
  })

  it('returns false on "testing" with a non tester', () => {
    const featureName = 'TEST_FEATURE_4'
    const flagName = 'FEATURE_FLAG_' + featureName
    process.env[flagName] = 'testing'
    const session = orm.session(orm.getEmptyState())
    const { Me } = session
    const currentUser = Me.create({
      id: nonTesterId
    })
    expect(currentUser.hasFeature(featureName)).toBeFalsy()
  })
})
