import orm from 'store/models'
import payload from '../MemberProfile.test.json'
import normalized from '../MemberProfile.normalized.test.json'
import { fetchRecentActivity, activitySelector } from './RecentActivity.store'

describe('fetchRecentActivity', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_RECENT_ACTIVITY',
      graphql: {
        query: 'Give me all the recent activity, please.',
        variables: {
          id: '12345',
          limit: 10,
          order: 'desc'
        }
      }
    }
    const { query, variables } = expected.graphql
    const actual = fetchRecentActivity(variables.id, 'desc', 10, query)
    expect(actual).toEqual(expected)
  })
})

describe('activitySelector', () => {
  let session = null
  let state = null
  let props = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    const { communities, memberships, person } = normalized
    session.Person.create(person)
    state = { orm: session.state }
    props = { personId: '46816', slug: 'wombats' }
  })

  it('indexes activityItems preseving sort order', () => {
    session.Post.create(normalized.posts[1])
    session.Comment.create(normalized.comments[0])
    const expected = [
      "Sat Apr 15 2017 16:27:55 GMT+1200 (NZST)",
      "Sat Mar 18 2017 10:48:43 GMT+1300 (NZDT)"
    ]
    const actual = activitySelector({ orm: session.state }, props)
      .map(item => item.createdAt)

    expect(actual).toEqual(expected)
  })
})
