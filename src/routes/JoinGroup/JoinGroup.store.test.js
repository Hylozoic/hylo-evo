import {
  MODULE_NAME,
  checkInvitation,
  useInvitation,
  getNewMembership,
  getValidInvite,
  defaultState
} from './JoinGroup.store'

describe('JoinGroup.store', () => {
  describe('checkInvitation action creator', () => {
    it('generates an action with all expected parameters', () => {
      const codes = {
        accessCode: 'accesstoken1',
        invitationToken: 'invitationtoken1'
      }
      expect(checkInvitation(codes)).toMatchSnapshot()
    })
  })

  describe('useInvitation action creator', () => {
    it('generates an action with all expected parameters', () => {
      const userId = '1'
      const codes = {
        accessCode: 'accesstoken1',
        invitationToken: 'invitationtoken1'
      }
      expect(useInvitation(userId, codes)).toMatchSnapshot()
    })
  })

  describe('getNewMembership', () => {
    const membership = { id: 'newmembership1' }
    const testState = {
      [MODULE_NAME]: {
        ...defaultState,
        membership
      }
    }
    const actual = getNewMembership(testState)
    expect(actual).toEqual(membership)
  })

  describe('getValidInvite', () => {
    const valid = false
    const testState = {
      [MODULE_NAME]: {
        ...defaultState,
        valid
      }
    }
    const actual = getValidInvite(testState)
    expect(actual).toEqual(valid)
  })
})
