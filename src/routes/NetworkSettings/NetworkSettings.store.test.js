import { updateCommunityHiddenSetting } from './NetworkSettings.store'

describe('updateCommunityHiddenSetting', () => {
  it('matches last snapshot', () => {
    expect(updateCommunityHiddenSetting(123, true)).toMatchSnapshot()
  })
})
