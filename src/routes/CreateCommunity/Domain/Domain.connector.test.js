import { mapDispatchToProps, mapStateToProps } from './Domain.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Domain', () => {
  it('should call fetchCommunity from mapDispatchToProps', () => {
    const communityName = 'Community Name'
    expect(dispatchProps.fetchCommunity(communityName)).toMatchSnapshot()
  })
  it('should call addCommunityDomain from mapDispatchToProps', () => {
    const communityDomain = 'domain'
    expect(dispatchProps.addCommunityDomain(communityDomain)).toMatchSnapshot()
  })
  it('should call goToNextStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToNextStep()).toMatchSnapshot()
  })
  it('should call goToPreviousStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToPreviousStep()).toMatchSnapshot()
  })
  it('should call goHome from mapDispatchToProps', () => {
    expect(dispatchProps.goHome()).toMatchSnapshot()
  })
  it('should have communityName in mapStateToProps', () => {
    const domain = 'domain'
    const state = {
      CreateCommunity: {
        domain
      }
    }
    expect(mapStateToProps(state, props).communityDomain).toBe(domain)
  })
})
