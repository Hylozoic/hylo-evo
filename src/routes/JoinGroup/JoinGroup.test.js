import React from 'react'
import { shallow } from 'enzyme'
import JoinGroup, { SIGNUP_PATH, EXPIRED_INVITE_PATH } from './JoinGroup'

const defaultProps = {
  currentUser: null,
  invitationToken: null,
  accessCode: null,
  groupSlug: null,
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

describe('JoinGroup', () => {
  it('should check for a valid invitation when not logged-in', () => {
    const testProps = {
      ...defaultProps,
      useInvitation: jest.fn(),
      checkInvitation: jest.fn()
    }
    shallow(<JoinGroup {...testProps} />)
    expect(testProps.useInvitation.mock.calls.length).toBe(0)
    expect(testProps.checkInvitation.mock.calls.length).toBe(1)
  })

  it('should redirect to signup if invite is valid when not logged-in', () => {
    const testProps = {
      ...defaultProps,
      isValidInvite: true,
      hasCheckedValidInvite: true
    }
    const wrapper = shallow(<JoinGroup {...testProps} />)
    expect(wrapper.find('Redirect').props().to).toContain(SIGNUP_PATH)
  })

  it('should redirect to expired page if invite is invalid when not logged-in', () => {
    const testProps = {
      ...defaultProps,
      isValidInvite: false,
      hasCheckedValidInvite: true
    }
    const wrapper = shallow(<JoinGroup {...testProps} />)
    expect(wrapper.find('Redirect').props().to).toContain(EXPIRED_INVITE_PATH)
  })

  it('should use invitation when already logged-in', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: true,
      checkInvitation: jest.fn(),
      useInvitation: jest.fn(),
      currentUser: { id: 'validUser' },
      groupSlug: 'mygroup',
      fetchForCurrentUser: jest.fn(() => Promise.resolve({ id: 'validUser' }))
    }
    const wrapper = shallow(<JoinGroup {...testProps} />)
    expect(testProps.checkInvitation.mock.calls.length).toBe(0)
    expect(testProps.useInvitation.mock.calls.length).toBe(1)
    expect(wrapper.find('Redirect').length).toEqual(1)
    expect(wrapper.find('Redirect').props().to).toContain(testProps.groupSlug)
  })

  it('should use invitation when logging in', () => {
    const testProps = {
      ...defaultProps,
      isLoggedIn: true,
      checkInvitation: jest.fn(),
      useInvitation: jest.fn(),
      currentUser: null,
      fetchForCurrentUser: jest.fn(() => Promise.resolve({ id: 'validUser' }))
    }
    const wrapper = shallow(<JoinGroup {...testProps} />)
    const groupSlug = 'mygroup'
    wrapper.setProps({
      isLoggedIn: true,
      currentUser: {
        id: 'validUser'
      },
      groupSlug
    })
    expect(testProps.checkInvitation.mock.calls.length).toBe(0)
    expect(testProps.fetchForCurrentUser.mock.calls.length).toBe(1)
    expect(testProps.useInvitation.mock.calls.length).toBe(1)
    expect(wrapper.find('Redirect').props().to).toContain(groupSlug)
  })
})

// NOTE: From legacy connector file, possibly useful reference to extend component tests
//
// import orm from 'store/models'
// import { MODULE_NAME } from './JoinGroup.store'
// import {
//   mapStateToProps,
//   mergeProps
// } from './JoinGroup.connector'

// const defaultProps = {
//   currentUser: null,
//   invitationToken: null,
//   accessCode: null,
//   groupSlug: null,
//   isLoggedIn: false,
//   hasCheckedValidInvite: false,
//   validInvite: null,
//   useInvitation: () => {},
//   checkInvitation: () => {},
//   match: {
//     accessCode: ''
//   },
//   location: {
//     search: ''
//   }
// }
//
// describe('JoinGroup.connector', () => {
//   describe('mapStateToProps', () => {
//     let state

//     beforeAll(() => {
//       const session = orm.session(orm.getEmptyState())

//       session.Me.create({
//         id: '1'
//       })

//       state = {
//         orm: session.state
//       }
//     })

//     it('hasCheckedValidInvite false when there is not a validInvite key', () => {
//       state[MODULE_NAME] = {}
//       const actual = mapStateToProps(state, defaultProps)
//       expect(actual.hasCheckedValidInvite).toBeFalsy()
//     })

//     it('hasCheckedValidInvite false when there is a null validInvite key', () => {
//       state[MODULE_NAME] = {
//         valid: null
//       }
//       const actual = mapStateToProps(state, defaultProps)
//       expect(actual.hasCheckedValidInvite).toBeFalsy()
//     })

//     it('gets the new newGroupSlug from the newMembership', () => {
//       const newGroupSlug = 'newgroup'
//       state[MODULE_NAME] = {
//         membership: {
//           group: {
//             slug: newGroupSlug
//           }
//         }
//       }
//       const actual = mapStateToProps(state, defaultProps)
//       expect(actual.groupSlug).toEqual(newGroupSlug)
//     })

//     it('isValidInvite gets set', () => {
//       state[MODULE_NAME] = {
//         valid: true
//       }
//       const actual = mapStateToProps(state, defaultProps)
//       expect(actual.isValidInvite).toEqual(true)
//     })
//   })

//   describe('mergeProps', () => {
//     it('wraps useInvitation and checkInvitation with the expected parameters', () => {
//       const invitationToken = 'invitationtoken1'
//       const accessCode = 'accesscode1'
//       const stateProps = { invitationToken, accessCode }
//       const dispatchProps = {
//         checkInvitation: jest.fn(),
//         useInvitation: jest.fn()
//       }
//       const ownProps = {}
//       const userId = '1'
//       const actual = mergeProps(stateProps, dispatchProps, ownProps)
//       actual.checkInvitation(userId)
//       expect(dispatchProps.checkInvitation).toBeCalledWith(
//         { invitationToken, accessCode }
//       )
//       actual.useInvitation(userId)
//       expect(dispatchProps.useInvitation).toBeCalledWith(
//         { invitationToken, accessCode }
//       )
//     })
//   })
// })
