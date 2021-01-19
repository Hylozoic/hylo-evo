import orm from 'store/models'
import { mapStateToProps, mapDispatchToProps } from './EventInviteDialog.connector'

jest.mock('lodash/fp', () => ({
  ...jest.requireActual('lodash/fp'),
  debounce: (_, fn) => {
    fn.cancel = jest.fn()
    return fn
  }
}))

describe('mapStateToProps', () => {
  it('returns the expected keys', () => {
    const session = orm.session(orm.getEmptyState())
    const state = { orm: session.state }
    const props = { forCommunities: [] }
    const stateProps = mapStateToProps(state, props)
    expect(stateProps).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('returns the expected keys', () => {
    const dispatch = r => r
    const result = mapDispatchToProps(dispatch)
    expect(result).toMatchSnapshot()
  })

  it('returns the expected action for fetchPeople', () => {
    const dispatch = r => r
    const result = mapDispatchToProps(dispatch)
    const fetchPeopleResult = result.fetchPeople('searchstring', [1, 2], {})
    expect(fetchPeopleResult).toMatchSnapshot()
  })
})
