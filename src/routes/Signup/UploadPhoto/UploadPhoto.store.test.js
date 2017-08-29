import { updateUserSettings } from './UploadPhoto.store'

describe('updateUserSettings', () => {
  it('should match latest snapshot', () => {
    const changes = {
      avatarUrl: 'www.avatarurl.com/my-avatar'
    }
    expect(updateUserSettings(changes)).toMatchSnapshot()
  })
})
