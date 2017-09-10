import {
  addCommunityName,
  addCommunityPrivacy,
  addCommunityDomain
} from './CreateCommunity.store'

describe('CreateCommunity store', () => {
  it('should call addCommunityName', () => {
    const communityName = 'name'
    expect(addCommunityName(communityName)).toMatchSnapshot()
  })
  it('should call addCommunityPrivacy', () => {
    const communityPrivacy = 'privacy'
    expect(addCommunityPrivacy(communityPrivacy)).toMatchSnapshot()
  })
  it('should call addCommunityDomain', () => {
    const communityDomain = 'domain'
    expect(addCommunityDomain(communityDomain)).toMatchSnapshot()
  })
})
