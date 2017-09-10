import { mapDispatchToProps, mapStateToProps } from './Review.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Domain', () => {
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

  it('should call clearDomainFromCreateCommunity from mapDispatchToProps', () => {
    expect(dispatchProps.clearDomainFromCreateCommunity()).toMatchSnapshot()
  })

  it('should have communityName in mapStateToProps', () => {
    const name = 'name'

    const state = {
      CreateCommunity: {
        name
      }
    }
    expect(mapStateToProps(state, props).communityName).toBe(name)
  })

  it('should have communityDomain in mapStateToProps', () => {
    const domain = 'domain'

    const state = {
      CreateCommunity: {
        domain
      }
    }
    expect(mapStateToProps(state, props).communityDomain).toBe(domain)
  })

  it('should have communityPrivacy in mapStateToProps', () => {
    const privacy = 'privacy'

    const state = {
      CreateCommunity: {
        privacy
      }
    }
    expect(mapStateToProps(state, props).communityPrivacy).toBe(privacy)
  })
})
