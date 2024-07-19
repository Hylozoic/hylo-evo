import { Model } from 'redux-orm'
import orm from 'store/models'
import getPost from 'store/selectors/getPost'

let session = null

beforeAll(() => {
  session = orm.session(orm.getEmptyState())
})

describe('getPost with non-existant post', () => {
  it('returns null', () => {
    expect(getPost({ orm: session.state }, { match: { params: { postId: '1' } } })).toEqual(null)
  })
})

describe('getPost for existing post', () => {
  it('returns post for editing (and ignores duplication param)', () => {
    const props = {
      match: { params: { postId: '2' } }
    }
    Model.withId = jest.fn(id => id)
    expect(getPost({ orm: session.state }, props)).toBe('2')
    expect(Model.withId.mock.results[0].value).toBe('2')
  })

  it('returns post for duplicating', () => {
    const props = {
      match: { params: {} },
      location: { search: '?fromPostId=3' }
    }
    Model.withId = jest.fn(id => id)
    expect(getPost({ orm: session.state }, props)).toBe('3')
    expect(Model.withId.mock.results[0].value).toBe('3')
  })
})
