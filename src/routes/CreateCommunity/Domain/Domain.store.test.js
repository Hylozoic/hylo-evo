import { addCommunityDomain, fetchCommunity } from './Domain.store'

describe('Domain store', () => {
  it('should call addCommunityDomain', () => {
    const domain = 'domain'
    expect(addCommunityDomain(domain)).toMatchSnapshot()
  })

  it('should call removeSkill', () => {
    const communityName = 'name'
    expect(fetchCommunity(communityName)).toMatchSnapshot()
  })
})
