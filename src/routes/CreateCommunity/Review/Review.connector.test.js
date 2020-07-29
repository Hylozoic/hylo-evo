import { mapDispatchToProps, mapStateToProps } from './Review.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Review.connector', () => {

  it('should call clearNameFromCreateCommunity from mapDispatchToProps', () => {
    expect(dispatchProps.clearNameFromCreateCommunity()).toMatchSnapshot()
  })

  it('should call fetchCommunityExists from mapDispatchToProps', () => {
    const slug = 'slug'
    expect(dispatchProps.fetchCommunityExists(slug)).toMatchSnapshot()
  })

  it('should call clearDomainFromCreateCommunity from mapDispatchToProps', () => {
    expect(dispatchProps.clearDomainFromCreateCommunity()).toMatchSnapshot()
  })

  it('should call goToCommunity from mapDispatchToProps', () => {
    const communityDomain = 'communityDomain'
    expect(dispatchProps.goToCommunity(communityDomain)).toMatchSnapshot()
  })

  it('should call goToStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToStep('name')).toMatchSnapshot()
  })

  it('should have communityName in mapStateToProps', () => {
    const name = 'name'

    const state = {
      CreateCommunity: {
        name,
        communityTemplates: []
      }
    }
    expect(mapStateToProps(state, props).name).toBe(name)
  })

  it('should have domain in mapStateToProps', () => {
    const domain = 'domain'

    const state = {
      CreateCommunity: {
        domain,
        communityTemplates: []
      }
    }
    expect(mapStateToProps(state, props).domain).toBe(domain)
  })

  it('should have privacy in mapStateToProps', () => {
    const privacy = 'privacy'

    const state = {
      CreateCommunity: {
        privacy,
        communityTemplates: []
      }
    }
    expect(mapStateToProps(state, props).privacy).toBe(privacy)
  })
})
