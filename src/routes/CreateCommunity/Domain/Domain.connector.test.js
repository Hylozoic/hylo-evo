import { mapDispatchToProps } from './Domain.connector'
describe('Domain', () => {
  it('should call fetchCommunity from mapDispatchToProps', () => {
    const dispatch = jest.fn(x => x)
    const props = {}
    const communityName = 'Community Name'
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.fetchCommunity(communityName)).toMatchSnapshot()
  })
  it('should call addCommunityDomain from mapDispatchToProps', () => {
    const dispatch = jest.fn(x => x)
    const props = {}
    const communityDomain = 'domain'
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.addCommunityDomain(communityDomain)).toMatchSnapshot()
  })
})
