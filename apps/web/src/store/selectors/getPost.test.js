import { Model } from 'redux-orm'
import orm from 'store/models'
import getPost from 'store/selectors/getPost'

let session = null

beforeAll(() => {
  session = orm.session(orm.getEmptyState())
})

describe('getPost with non-existant post', () => {
  it('returns null', () => {
    expect(getPost(1)).toEqual(null)
  })
})

describe('getPost for existing post', () => {
  it('returns post for editing (and ignores duplication param)', () => {
    Model.withId = jest.fn(id => id)
    expect(getPost(2)).toBe('2')
    expect(Model.withId.mock.results[0].value).toBe('2')
  })
})
