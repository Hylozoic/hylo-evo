import { updateUserSettings } from './AddLocation.store'

describe('updateUserSettings', () => {
  it('should match latest snapshot', () => {
    const changes = {
      location: 'Vallis Aples'
    }
    expect(updateUserSettings(changes)).toMatchSnapshot()
  })
})
