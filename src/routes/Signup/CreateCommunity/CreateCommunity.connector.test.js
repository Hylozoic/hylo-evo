import { mapDispatchToProps } from './CreateCommunity.connector'

describe('Create Community mapDispatchToProps', () => {
  it('should match the latest snapshot for createCommunity', () => {
    expect(mapDispatchToProps.createCommunity('My Community')).toMatchSnapshot()
  })
})
