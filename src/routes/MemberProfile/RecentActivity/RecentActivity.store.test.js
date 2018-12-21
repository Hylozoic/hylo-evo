import orm from 'store/models'
import normalized from '../MemberProfile.normalized.test.json'
import { fetchRecentActivity, getRecentActivity } from './RecentActivity.store'
import { mapStateToProps } from './RecentActivity.connector'

describe('fetchRecentActivity', () => {
  it('returns the correct action', () => {
    const expected = {
      type: 'FETCH_RECENT_ACTIVITY',
      graphql: {
        query: 'Give me all the recent activity, please.',
        variables: {
          id: '12345',
          first: 10,
          order: 'desc'
        }
      },
      meta: { extractModel: 'Person' }
    }
    const { query, variables } = expected.graphql
    const actual = fetchRecentActivity(variables.id, 10, query)
    expect(actual).toEqual(expected)
  })
})

describe('connector', () => {
  let session = undefined
  let state = null
  let props = undefined

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    session.Person.create(normalized.person)
    session.Post.create(normalized.posts[1])
    session.Comment.create(normalized.comments[0])
    state = { orm: session.state }
    props = { routeParams: { personId: '46816', slug: 'wombats' } }
  })

  describe('getRecentActivity', () => {
    it('indexes activityItems preseving sort order', () => {
      const expected = [
        'Sat Apr 15 2017 16:27:55 GMT+1200 (NZST)',
        'Sat Mar 18 2017 10:48:43 GMT+1300 (NZDT)'
      ]
      const actual = getRecentActivity(state, props)
        .map(item => item.createdAt)

      expect(actual).toEqual(expected)
    })

    it('selects Comments and Posts if both are present', () => {
      const allItems = getRecentActivity(state, props)
      const postItems = allItems.filter(item => item.title)
      expect(postItems.length).toBeLessThan(allItems.length)
    })
  })

  describe('mapStateToProps', () => {
    it('returns an activityItems property of the correct length', () => {
      const actual = mapStateToProps(state, props).activityItems.length
      expect(actual).toBe(2)
    })
  })
})
