import React from 'react'
import { MemoryRouter } from 'react-router'
import { shallow } from 'enzyme'
import JoinCommunity, { SIGNUP_PATH, EXPIRED_INVITE_PATH } from './JoinCommunity'

const defaultProps = {
  currentUser: null,
  invitationToken: null,
  accessCode: null,
  communitySlug: null,
  isLoggedIn: false,
  hasCheckedValidInvite: false,
  validInvite: null,
  useInvitation: () => {},
  checkInvitation: () => {},
  match: {
    accessCode: ''
  },
  location: {
    search: ''
  }
}

describe('JoinCommunity', () => {
  it('should check for a valid invitation when not logged-in', () => {
    const testProps = {
      ...defaultProps,
      useInvitation: jest.fn(),
      checkInvitation: jest.fn()
    }
    shallow(<JoinCommunity {...testProps} />)
    expect(testProps.useInvitation.mock.calls.length).toBe(0)
    expect(testProps.checkInvitation.mock.calls.length).toBe(1)
  })

  it('should redirect to signup if invite is valid when not logged-in', () => {
    const testProps = {
      ...defaultProps,
      isValidInvite: true,
      hasCheckedValidInvite: true
    }
    const wrapper = shallow(<JoinCommunity {...testProps} />)
    expect(wrapper.find('Redirect').props().to).toContain(SIGNUP_PATH)
  })

  it('should redirect to expired page if invite is invalid when not logged-in', () => {
    const testProps = {
      ...defaultProps,
      isValidInvite: false,
      hasCheckedValidInvite: true
    }
    const wrapper = shallow(<JoinCommunity {...testProps} />)
    expect(wrapper.find('Redirect').props().to).toContain(EXPIRED_INVITE_PATH)
  })

  it('should use invitation when already logged-in', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: true,
      checkInvitation: jest.fn(),
      useInvitation: jest.fn(),
      currentUser: {id: 'validUser'},
      communitySlug: 'mycommunity',
      fetchForCurrentUser: jest.fn(() => Promise.resolve({id: 'validUser'}))
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
      checkInvitation: jest.fn(),
      useInvitation: jest.fn(),
      currentUser: null,
      fetchForCurrentUser: jest.fn(() => Promise.resolve({id: 'validUser'}))
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
    expect(testProps.fetchForCurrentUser.mock.calls.length).toBe(1)
    expect(testProps.useInvitation.mock.calls.length).toBe(1)
    expect(wrapper.find('Redirect').props().to).toContain(communitySlug)
  })
})
