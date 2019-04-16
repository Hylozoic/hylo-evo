import { presentPerson, invitePeopleToEvent } from './EventInviteDialog.store'

describe('presentPerson', () => {
  it('extracts the right keys', () => {
    const peopleModel = {
      ref: {
        id: 1,
        name: 'jo',
        avatarUrl: 'jo.png',
        unusedField: 'yup'
      },
      memberships: {
        first: () => ({
          community: {
            name: 'coomunity'
          }
        })
      }
    }

    expect(presentPerson(peopleModel)).toMatchSnapshot()
  })
})

describe('invitePeopleToEvent', () => {
  it('matches snapshot', () => {
    expect(invitePeopleToEvent(1, [2, 3, 4])).toMatchSnapshot()
  })
})
