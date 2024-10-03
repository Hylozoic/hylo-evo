import { invitePeopleToEvent } from './EventInviteDialog.store'

describe('invitePeopleToEvent', () => {
  it('matches snapshot', () => {
    expect(invitePeopleToEvent(1, [2, 3, 4])).toMatchSnapshot()
  })
})
