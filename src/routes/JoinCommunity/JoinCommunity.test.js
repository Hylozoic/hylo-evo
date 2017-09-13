import React from 'react'
import { shallow } from 'enzyme'
// import { useInvitation, checkInvitation } from './JoinCommunity.store'
import { mapStateToProps } from './JoinCommunity.connector'
import JoinCommunity from './JoinCommunity'

const defaultProps = {
  currentUser: null,
  invitationToken: null,
  communitySlug: null,
  isLoggedIn: false,
  hasCheckedValidToken: false,
  validToken: null,
  userInvitation: () => {},
  checkInvitation: () => {},
  location: {
    search: ''
  }
}

describe('connector', () => {
  describe('mapStateToProps', () => {
    it('hasCheckedValidToken false when there is not a validToken key', () => {
      const state = {
        JoinCommunity: {}
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.hasCheckedValidToken).toBeFalsy()
    })

    it('hasCheckedValidToken false when there is a null validToken key', () => {
      const state = {
        JoinCommunity: {
          validToken: null
        }
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.hasCheckedValidToken).toBeFalsy()
    })

    it('gets the new newCommunitySlug from the newMembership', () => {
      const newCommunitySlug = 'newcommunity'
      const state = {
        JoinCommunity: {
          membership: {
            community: {
              slug: newCommunitySlug
            }
          }
        }
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.communitySlug).toEqual(newCommunitySlug)
    })

    it('validToken is set', () => {
      const state = {
        JoinCommunity: {
          valid: true
        }
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.validToken).toEqual(true)
    })
  })
})

// if (!isLoggedIn && hasCheckedValidToken) {
//   if (validToken) {
//     return <Redirect to={LOGIN_PATH} />
//   } else {
//     return <Redirect to={EXPIRED_INVITE_PATH} />
//   }
// }
// if (isLoggedIn && communitySlug) return <Redirect to={communityUrl(communitySlug)} />

describe('component', () => {
  it('should check for a valid invitation when not logged in', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: false,
      hasCheckedValidToken: false,
      checkInvitation: jest.fn()
    }
    shallow(<JoinCommunity {...testProps} />)
    expect(testProps.checkInvitation.mock.calls.length).toBe(1)
  })

  it('should use invitation when logged in', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: true,
      invitationToke: 'aslkjdflkjsadf',
      checkInvitation: jest.fn(),
      useInvitation: jest.fn(),
      router: {}
    }
    const wrapper = shallow(<JoinCommunity {...testProps} />)
    wrapper.setProps({
      isLoggedIn: true,
      currentUser: {
        id: 'validUser'
      },
      communitySlug: '/c/mycommunity'
    })
    expect(testProps.checkInvitation.mock.calls.length).toBe(0)
    expect(testProps.useInvitation.mock.calls.length).toBe(1)
    console.log(wrapper.html())
  })
})
