import { mapDispatchToProps } from './AddLocation.connector'

describe('mapDispatchToProps', () => {
  it('CreateCommunity should match latest snapshot', () => {
    const changes = {
      location: 'Vallis Aples'
    }
    expect(mapDispatchToProps.updateUserSettings(changes)).toMatchSnapshot()
  })
})
