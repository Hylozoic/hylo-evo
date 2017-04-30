import orm from 'store/models'
import { matchesSelector } from './PeopleSelectorMatches.store'

// Contents: all people matched with autocomplete = 'h' in a test db
import people from './PeopleSelectorMatches.test.json'

describe('selector', () => {
  let session = null
  let state = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    people.forEach(p => session.Person.create(p))
    state = { orm: session.state, NewMessageThread: {} }
  })

  describe('autocompleteMatches', () => {
    it('correctly matches all Person entities', () => {
      state.NewMessageThread.autocomplete = 'h'
      const actual = matchesSelector(state)
      expect(actual.length).toBe(people.length)
    })

    it('uses a case insensitive match', () => {
      state.NewMessageThread.autocomplete = 'H'
      const actual = matchesSelector(state)
      expect(actual.length).toBe(people.length)
    })

    it('does not find an entity where no letter match exists', () => {
      state.NewMessageThread.autocomplete = 'x'
      const actual = matchesSelector(state)
      expect(actual.length).toBe(0)
    })

    it('returns null if autocomplete is not set', () => {
      const actual = matchesSelector(state)
      expect(actual).toBe(null)
    })

    it('narrows the search correctly', () => {
      state.NewMessageThread.autocomplete = 'het'
      const actual = matchesSelector(state)
      expect(actual.length).toBe(1)
    })
  })
})
