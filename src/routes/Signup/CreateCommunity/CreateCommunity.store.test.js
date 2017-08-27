import { createCommunity } from './CreateCommunity.store'

describe('createCommunity', () => {
  it('should match latest snapshot', () => {
    expect(createCommunity('Community Name')).toMatchSnapshot()
  })
})
