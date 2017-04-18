import { mapStateToProps } from './MemberProfile.connector'
import payload from './MemberProfile.normalized.test.json'

describe('MemberProfile.connector', () => {
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

})
