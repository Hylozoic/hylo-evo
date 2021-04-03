import orm from 'store/models'
import {
  findMentions,
  findTopics,
  getMentionResults
} from './HyloEditor.store'
import {
  FIND_MENTIONS,
  MODULE_NAME
} from './HyloEditor.constants.js'

const people = [
  { id: 0, name: 'Test User', avatarUrl: 'avatarURL0' },
  { id: 1, name: 'RESUE TSET', avatarUrl: 'avatarURL1' },
  { id: 2, name: 'Another Lastname', avatarUrl: 'avatarURL2' },
  { id: 3, name: 'Someone Else', avatarUrl: 'avatarURL3' }
]

describe('findMentions', () => {
  it('returns the correct action', () => {
    const mentionSearchTerm = 'user'
    const expected = {
      type: FIND_MENTIONS,
      graphql: {
        variables: {
          mentionSearchTerm
        }
      },
      meta: { extractModel: 'Person' }
    }
    const actual = findMentions(mentionSearchTerm)
    expect(actual.type).toEqual(expected.type)
    expect(actual.graphql.variables).toEqual(expected.graphql.variables)
    expect(actual.meta.type).toEqual(expected.meta.type)
  })
})

describe('getMentionResults selector', () => {
  let session = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())
    people.forEach(person => session.Person.create(person))
  })

  const getSearchState = (mentionSearchTerm) => {
    return {
      [MODULE_NAME]: { mentionSearchTerm },
      orm: session.state
    }
  }

  it('no results are found with an empty search string', () => {
    const results = getMentionResults(getSearchState(''))
    expect(results.length).toEqual(0)
  })

  it('finds using lowercase', () => {
    const results = getMentionResults(getSearchState('test'))
    expect(results.length).toEqual(1)
    expect(results[0].name).toEqual(people[0].name)
  })

  it('finds in parts of names to return multiple matches', () => {
    const results = getMentionResults(getSearchState('se'))
    expect(results.length).toEqual(3)
  })

  it('transforms avatarURL key to avatar on results', () => {
    const results = getMentionResults(getSearchState('test'))
    expect(results[0].avatar).toBeTruthy()
  })
})

describe('findTopics', () => {
  it('queries groupTopics at the top level', () => {
    expect(findTopics('foo')).toMatchSnapshot()
  })
})
