import { mapDispatchToProps } from './UploadPhoto.connector'

describe('UploadPhoto mapDispatchToProps', () => {
  it('should match latest snapshot for updateUserSettings ', () => {
    const changes = {
      avatarUrl: 'www.avatarurl.com/my-avatar'
    }
    expect(mapDispatchToProps.updateUserSettings(changes)).toMatchSnapshot()
  })
})
