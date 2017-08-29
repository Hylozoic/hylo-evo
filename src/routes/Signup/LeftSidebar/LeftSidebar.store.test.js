import { updateUserSettings } from './LeftSidebar.store'

describe('updateUserSettings', () => {
  it('should match latest snapshot', () => {
    const changes = {settings: {'signupInProgress': false}}
    expect(updateUserSettings(changes)).toMatchSnapshot()
  })
})
