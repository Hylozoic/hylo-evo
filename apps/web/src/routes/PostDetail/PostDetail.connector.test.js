import orm from 'store/models'

import { mapStateToProps, mapDispatchToProps } from './PostDetail.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const session = orm.session(orm.getEmptyState())
    const state = {
      orm: session.state,
      pending: {}
    }
    const props = {
      match: {},
      location: {
        search: ''
      }
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})

describe('mapDispatchToProps', () => {
  it('returns the right keys', () => {
    const props = {
      match: {},
      location: {
        pathname: ''
      }
    }
    expect(mapDispatchToProps(() => {}, props)).toMatchSnapshot()
  })
})
