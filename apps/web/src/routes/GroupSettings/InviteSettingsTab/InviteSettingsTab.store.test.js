import {
  ormSessionReducer,
  CREATE_INVITATIONS,
  RESEND_INVITATION_PENDING,
  EXPIRE_INVITATION_PENDING,
  REINVITE_ALL_PENDING,
  allowGroupInvites
} from './InviteSettingsTab.store'
import orm from 'store/models'

describe('InviteSettingsTab.store.ormSessionReducer', () => {
  let session
  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('responds to CREATE_INVITATIONS', () => {
    session.Group.create({ id: '5' })

    const action = {
      type: CREATE_INVITATIONS,
      payload: {
        data: {
          createInvitation: {
            invitations: [
              { email: 'foo5@bar.com' },
              { email: 'foo6@bar.com' },
              { email: 'foo7@bar.com' }
            ]
          }
        }
      },
      meta: { groupId: '5' }
    }

    ormSessionReducer(session, action)
    const now = new Date().getTime()
    const invitations = session.Invitation.all().toRefArray()
    expect(invitations).toEqual([
      expect.objectContaining({ email: 'foo5@bar.com', group: '5' }),
      expect.objectContaining({ email: 'foo6@bar.com', group: '5' }),
      expect.objectContaining({ email: 'foo7@bar.com', group: '5' })
    ])
    invitations.forEach(i => {
      const createdAt = new Date(i.createdAt).getTime()
      expect(now - createdAt).toBeLessThan(1000)
    })
  })

  it('responds to RESEND_INVITATION_PENDING', () => {
    session.Invitation.create({ id: '4' })
    const action = {
      type: RESEND_INVITATION_PENDING,
      meta: { invitationToken: '4' }
    }
    ormSessionReducer(session, action)
    expect(session.Invitation.withId('4').resent).toBeTruthy()
  })

  it('responds to EXPIRE_INVITATION_PENDING', () => {
    session.Invitation.create({ id: '3' })
    const action = {
      type: EXPIRE_INVITATION_PENDING,
      meta: { invitationToken: '3' }
    }
    ormSessionReducer(session, action)
    expect(session.Invitation.idExists('3')).toBeFalsy()
  })

  it('responds to REINVITE_ALL_PENDING', () => {
    session.Group.create({ id: '1' })
    session.Invitation.create({ id: '2', group: '1' })
    session.Invitation.create({ id: '3', group: '1' })
    session.Invitation.create({ id: '4', group: '1' })
    session.Invitation.create({ id: '5' })
    const action = {
      type: REINVITE_ALL_PENDING,
      meta: { groupId: '1' }
    }
    ormSessionReducer(session, action)
    expect(
      session.Invitation.filter(i => i.group === '1')
        .toRefArray().map(i => i.resent)
    ).toEqual([true, true, true])
    expect(session.Invitation.withId('5').resent).toBeFalsy()
  })

  it('matches the last snapshot for allowGroupInvites', () => {
    expect(allowGroupInvites('1', false)).toMatchSnapshot()
  })
})
