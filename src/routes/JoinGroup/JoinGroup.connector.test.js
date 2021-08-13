import orm from 'store/models'
import { MODULE_NAME } from './JoinGroup.store'
import {
  mapStateToProps,
  mergeProps
} from './JoinGroup.connector'

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

describe('JoinGroup.connector', () => {
  describe('mapStateToProps', () => {
    let state

    beforeAll(() => {
      const session = orm.session(orm.getEmptyState())

      session.Me.create({
        id: '1'
      })

      state = {
        orm: session.state
      }
    })

    it('hasCheckedValidInvite false when there is not a validInvite key', () => {
      state[MODULE_NAME] = {}
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.hasCheckedValidInvite).toBeFalsy()
    })

    it('hasCheckedValidInvite false when there is a null validInvite key', () => {
      state[MODULE_NAME] = {
        valid: null
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.hasCheckedValidInvite).toBeFalsy()
    })

    it('gets the new newGroupSlug from the newMembership', () => {
      const newGroupSlug = 'newgroup'
      state[MODULE_NAME] = {
        membership: {
          group: {
            slug: newGroupSlug
          }
        }
      }
      const actual = mapStateToProps(state, defaultProps)
      expect(actual.groupSlug).toEqual(newGroupSlug)
    })

    it('isValidInvite gets set', () => {
      state[MODULE_NAME] = {
        valid: true
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
        { invitationToken, accessCode }
      )
    })
  })
})
