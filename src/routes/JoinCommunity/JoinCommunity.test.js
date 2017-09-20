import React from 'react'
import { shallow } from 'enzyme'
import { mapStateToProps } from './JoinCommunity.connector'
import { MODULE_NAME } from './JoinCommunity.store'
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
        [MODULE_NAME]: {}
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.hasCheckedValidToken).toBeFalsy()
    })

    it('hasCheckedValidToken false when there is a null validToken key', () => {
      const state = {
        [MODULE_NAME]: {
          validToken: null
        }
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.hasCheckedValidToken).toBeFalsy()
    })

    it('gets the new newCommunitySlug from the newMembership', () => {
      const newCommunitySlug = 'newcommunity'
      const state = {
        [MODULE_NAME]: {
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

    it('validToken gets set', () => {
      const state = {
        [MODULE_NAME]: {
          valid: true
        }
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.validToken).toEqual(true)
    })
  })
})

describe('component', () => {
  it('should check for a valid invitation when not logged in', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: false,
      hasCheckedValidToken: false,
      useInvitation: jest.fn(),
      checkInvitation: jest.fn()
    }
    shallow(<JoinCommunity {...testProps} />)
    expect(testProps.useInvitation.mock.calls.length).toBe(0)
    expect(testProps.checkInvitation.mock.calls.length).toBe(1)
  })

  it('should use invitation when already logged in', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: true,
      invitationToken: 'aslkjdflkjsadf',
      checkInvitation: jest.fn(),
      useInvitation: jest.fn(),
      currentUser: {id: 'validUser'},
      communitySlug: 'mycommunity'
    }
    const wrapper = shallow(<JoinCommunity {...testProps} />)
    expect(testProps.checkInvitation.mock.calls.length).toBe(0)
    expect(testProps.useInvitation.mock.calls.length).toBe(1)
    expect(wrapper.find('Redirect').length).toEqual(1)
    expect(wrapper.find('Redirect').props().to).toContain(testProps.communitySlug)
  })

  it('should use invitation when logging in', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: true,
      invitationToken: 'aslkjdflkjsadf',
      checkInvitation: jest.fn(),
      useInvitation: jest.fn(),
      currentUser: null
    }
    const wrapper = shallow(<JoinCommunity {...testProps} />)
    const communitySlug = 'mycommunity'
    wrapper.setProps({
      isLoggedIn: true,
      currentUser: {
        id: 'validUser'
      },
      communitySlug
    })
    expect(testProps.checkInvitation.mock.calls.length).toBe(0)
    expect(testProps.useInvitation.mock.calls.length).toBe(1)
    expect(wrapper.find('Redirect').props().to).toContain(communitySlug)
  })
})
