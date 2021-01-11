import orm from 'store/models'
import { mapDispatchToProps, mapStateToProps } from './Review.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Domain', () => {
  let state

  beforeAll(() => {
    const session = orm.session(orm.getEmptyState())
    state = {
      orm: session.state
    }
  })

  it('should call updateUserSettings from mapDispatchToProps', () => {
    const changes = {
      name: 'name',
      email: 'email'
    }
    expect(dispatchProps.updateUserSettings(changes)).toMatchSnapshot()
  })

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

  it('should call goToNextStep from mapDispatchToProps', () => {
    const communityDomain = 'communityDomain'
    expect(dispatchProps.goToCommunity(communityDomain)).toMatchSnapshot()
  })

  it('should call goToPrivacyStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToPrivacyStep()).toMatchSnapshot()
  })

  it('should have communityName in mapStateToProps', () => {
    const name = 'name'

    state = Object.assign(state, {
      CreateCommunity: {
        name
      }
    })
    expect(mapStateToProps(state, props).communityName).toBe(name)
  })

  it('should have communityDomain in mapStateToProps', () => {
    const domain = 'domain'

    state = Object.assign(state, {
      CreateCommunity: {
        domain
      }
    })
    expect(mapStateToProps(state, props).communityDomain).toBe(domain)
  })

  it('should have communityPrivacy in mapStateToProps', () => {
    const privacy = 'privacy'

    state = Object.assign(state, {
      CreateCommunity: {
        privacy
      }
    })
    expect(mapStateToProps(state, props).communityPrivacy).toBe(privacy)
  })
})
