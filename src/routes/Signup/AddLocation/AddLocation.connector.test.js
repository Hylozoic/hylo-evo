import { mapDispatchToProps } from './AddLocation.connector'

describe('AddLocation mapDispatchToProps', () => {
  it('should match latest snapshot for updateUserSettings', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})
