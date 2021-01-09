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

  it('should call clearNameFromCreateGroup from mapDispatchToProps', () => {
    expect(dispatchProps.clearNameFromCreateGroup()).toMatchSnapshot()
  })

  it('should call fetchGroupExists from mapDispatchToProps', () => {
    const slug = 'slug'
    expect(dispatchProps.fetchGroupExists(slug)).toMatchSnapshot()
  })

  it('should call clearDomainFromCreateGroup from mapDispatchToProps', () => {
    expect(dispatchProps.clearDomainFromCreateGroup()).toMatchSnapshot()
  })

  it('should call goToNextStep from mapDispatchToProps', () => {
    const groupDomain = 'groupDomain'
    expect(dispatchProps.goToGroup(groupDomain)).toMatchSnapshot()
  })

  it('should call goToPrivacyStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToPrivacyStep()).toMatchSnapshot()
  })

  it('should have groupName in mapStateToProps', () => {
    const name = 'name'

    const state = {
      CreateGroup: {
        name
      }
    }
    expect(mapStateToProps(state, props).groupName).toBe(name)
  })

  it('should have groupDomain in mapStateToProps', () => {
    const domain = 'domain'

    state = Object.assign(state, {
      CreateCommunity: {
        name
      }
    })
    expect(mapStateToProps(state, props).groupDomain).toBe(domain)
  })

  it('should have groupPrivacy in mapStateToProps', () => {
    const privacy = 'privacy'

    state = Object.assign(state, {
      CreateCommunity: {
        name
      }
    })
    expect(mapStateToProps(state, props).groupPrivacy).toBe(privacy)
  })
})
