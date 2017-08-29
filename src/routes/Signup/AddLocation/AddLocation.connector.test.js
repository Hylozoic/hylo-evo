import { mapDispatchToProps } from './AddLocation.connector'

describe('AddLocation mapDispatchToProps', () => {
  it('should match latest snapshot for updateUserSettings', () => {
    const changes = {
      location: 'Vallis Aples'
    }
    expect(mapDispatchToProps.updateUserSettings(changes)).toMatchSnapshot()
  })
})
