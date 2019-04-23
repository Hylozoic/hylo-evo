import { MODULE_NAME } from './JoinCommunity.store'
import {
  mapStateToProps,
  mergeProps
} from './JoinCommunity.connector'

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

describe('JoinCommunity.connector', () => {
  describe('mapStateToProps', () => {
    it('hasCheckedValidInvite false when there is not a validInvite key', () => {
      const state = {
        [MODULE_NAME]: {}
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.hasCheckedValidInvite).toBeFalsy()
    })

    it('hasCheckedValidInvite false when there is a null validInvite key', () => {
      const state = {
        [MODULE_NAME]: {
          valid: null
        }
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.hasCheckedValidInvite).toBeFalsy()
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

    it('isValidInvite gets set', () => {
      const state = {
        [MODULE_NAME]: {
          valid: true
        }
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.isValidInvite).toEqual(true)
    })
  })

  describe('mergeProps', () => {
    it('wraps useInvitation and checkInvitation with the expected parameters', () => {
      const invitationToken = 'invitationtoken1'
      const accessCode = 'accesscode1'
      const stateProps = { invitationToken, accessCode }
      const dispatchProps = {
        checkInvitation: jest.fn(),
        useInvitation: jest.fn()
      }
      const ownProps = {}
      const userId = '1'
      const actual = mergeProps(stateProps, dispatchProps, ownProps)
      actual.checkInvitation(userId)
      expect(dispatchProps.checkInvitation).toBeCalledWith(
        { invitationToken, accessCode }
      )
      actual.useInvitation(userId)
      expect(dispatchProps.useInvitation).toBeCalledWith(
        userId, { invitationToken, accessCode }
      )
    })
  })
})
