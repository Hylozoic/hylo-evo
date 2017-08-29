import { mapDispatchToProps } from './LeftSidebar.connector'

describe('mapDispatchToProps', () => {
  it('updateUserSettings should match latest snapshot', () => {
    const changes = {settings: {'signupInProgress': false}}
    expect(mapDispatchToProps.updateUserSettings(changes).toMatchSnapshot())
  })
})
