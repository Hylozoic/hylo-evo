import { mapDispatchToProps } from './LeftSidebar.connector'

describe('mapDispatchToProps', () => {
  it('should match latest snapshot for updateUserSettings', () => {
    const changes = {settings: {'signupInProgress': false}}
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})
