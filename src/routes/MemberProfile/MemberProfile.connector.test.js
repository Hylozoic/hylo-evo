import orm from 'store/models'
import { getPerson, mapStateToProps } from './MemberProfile.connector'
import payload from './MemberProfile.normalized.test.json'
import denormalized from './MemberProfile.test.json'

describe('MemberProfile.connector', () => {
  let session = null

  beforeEach(() => {
    session = orm.mutableSession(orm.getEmptyState())

    const { person, posts, communities } = payload
    session.Person.create(person)
    session.Community.create(communities[0])
    session.Post.create(posts[0])
  })

  describe('mapStateToProps', () => {

    it('Sets an error when id missing from route params', () => {
      const params = {}
      const actual = mapStateToProps({}, { match: { params } })
      expect(actual.error).toBeTruthy()
    })

    it('Gets the correct person when id included in route params', () => {
      const expected = payload.person.id
      const params = { id: expected }
      const actual = mapStateToProps({}, { match: { params } }).id
      expect(actual).toEqual(expected)
    })
  })

  describe('getPerson', () => {
    it('Returns null for a non-existent entity', () => {
      const actual = getPerson('1')(session.state)
        expect(actual).toBe(null)
    })

    it('Populates relations correctly', () => {
      const { person } = denormalized.data
        const expected = {
          ...person,
          posts: person.posts.map(post => ({ ...post, creator: post.creator.id }))
        }
      const actual = getPerson(payload.person.id)(session.state)
        expect(actual).toEqual(expected)
    })
  })
})
