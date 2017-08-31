import { mapDispatchToProps } from './LeftSidebar.connector'

describe('mapDispatchToProps', () => {
  it('should match latest snapshot for updateUserSettings', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})
