import { mapDispatchToProps } from './UploadPhoto.connector'

describe('UploadPhoto mapDispatchToProps', () => {
  it('should match latest snapshot for updateUserSettings ', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})
