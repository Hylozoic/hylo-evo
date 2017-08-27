import { mapDispatchToProps } from './CreateCommunity.connector'

describe('mapDispatchToProps', () => {
  it('CreateCommunity should match latest snapshot', () => {
    expect(mapDispatchToProps.createCommunity('My Community')).toMatchSnapshot()
  })
})
