import orm from 'store/models'
import { mapStateToProps } from './PrimaryLayout.connector'

const emptyState = {
  PrimaryLayout: {},
  pending: {}
}

describe('PrimaryLayout.connector', () => {
  it('should get correct value for returnToPath from state', () => {
    const session = orm.session(orm.getEmptyState())
    const returnToPath = '/anything'
    const state = {
      ...emptyState,
      orm: session.state,
      returnToPath
    }
    expect(mapStateToProps(state, {
      match: { params: {} },
      location: { pathname: '' }
    })).toHaveProperty('returnToPath', returnToPath)
  })
})
