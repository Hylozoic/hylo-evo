import {
  ormSessionReducer,
  CREATE_INVITATIONS,
  RESEND_INVITATION_PENDING,
  EXPIRE_INVITATION_PENDING,
  REINVITE_ALL_PENDING
} from './InviteSettingsTab.store'
import orm from 'store/models'

describe('InviteSettingsTab.store.ormSessionReducer', () => {
  let session
  beforeEach(() => {
    session = orm.session(orm.getEmptyState())
  })

  it('responds to CREATE_INVITATIONS', () => {
    session.Community.create({id: '5'})

    const action = {
      type: CREATE_INVITATIONS,
      payload: {
        data: {
          createInvitation: {
            invitations: [
              {email: 'foo5@bar.com'},
              {email: 'foo6@bar.com'},
              {email: 'foo7@bar.com'}
            ]
          }
        }
      },
      meta: {communityId: '5'}
    }

    ormSessionReducer(session, action)
    const now = new Date().getTime()
    const invitations = session.Invitation.all().toRefArray()
    expect(invitations).toEqual([
      expect.objectContaining({email: 'foo5@bar.com', community: '5'}),
      expect.objectContaining({email: 'foo6@bar.com', community: '5'}),
      expect.objectContaining({email: 'foo7@bar.com', community: '5'})
    ])
    invitations.forEach(i => {
      const createdAt = new Date(i.createdAt).getTime()
      expect(now - createdAt).toBeLessThan(1000)
    })
  })

  it('responds to RESEND_INVITATION_PENDING', () => {
    session.Invitation.create({id: '4'})
    const action = {
      type: RESEND_INVITATION_PENDING,
      meta: {invitationToken: '4'}
    }
    ormSessionReducer(session, action)
    expect(session.Invitation.withId('4').resent).toBeTruthy()
  })

  it('responds to EXPIRE_INVITATION_PENDING', () => {
    session.Invitation.create({id: '3'})
    const action = {
      type: EXPIRE_INVITATION_PENDING,
      meta: {invitationToken: '3'}
    }
    ormSessionReducer(session, action)
    expect(session.Invitation.hasId('3')).toBeFalsy()
  })

  it('responds to REINVITE_ALL_PENDING', () => {
    session.Community.create({id: '1'})
    session.Invitation.create({id: '2', community: '1'})
    session.Invitation.create({id: '3', community: '1'})
    session.Invitation.create({id: '4', community: '1'})
    session.Invitation.create({id: '5'})
    const action = {
      type: REINVITE_ALL_PENDING,
      meta: {communityId: '1'}
    }
    ormSessionReducer(session, action)
    expect(
      session.Invitation.filter(i => i.community === '1')
      .toRefArray().map(i => i.resent)
    ).toEqual([true, true, true])
    expect(session.Invitation.withId('5').resent).toBeFalsy()
  })
})
