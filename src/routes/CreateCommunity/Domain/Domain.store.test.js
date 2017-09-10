import { fetchCommunity } from './Domain.store'

describe('Domain store', () => {
  it('should call removeSkill', () => {
    const communityName = 'name'
    expect(fetchCommunity(communityName)).toMatchSnapshot()
  })
})
