import orm from 'store/models'
import { mapStateToProps } from './AuthLayoutRouter.connector'

const emptyState = {
  AuthLayoutRouter: {},
  pending: {}
}

describe('AuthLayoutRouter.connector', () => {
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
