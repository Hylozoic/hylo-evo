import orm from 'store/models'
import people from './NewMessageThread.test.json'
import { participantsSelector } from './NewMessageThread.store'

describe('connector', () => {
  let session = null
  let state = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    people.forEach(person => session.Person.create(person))
    state = { orm: session.state }
    state.NewMessageThread = { participants: people.map(p => p.id) }
  })

  describe('participantsSelector', () => {
    it('returns the correct objects', () => {
      const expected = people.map(p => ({
        id: p.id,
        name: p.name,
        avatarUrl: p.avatarUrl
      }))
      const actual = participantsSelector(state)
      expect(actual).toEqual(expected)
    })
  })
})

