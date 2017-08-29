import { mapDispatchToProps } from './UploadPhoto.connector'

describe('mapDispatchToProps', () => {
  it('updateUserSettings should match latest snapshot', () => {
    const changes = {
      avatarUrl: 'www.avatarurl.com/my-avatar'
    }
    expect(mapDispatchToProps.updateUserSettings(changes)).toMatchSnapshot()
  })
})
