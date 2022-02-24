import orm from 'store/models'
import { mapStateToProps } from './PrimaryLayout.connector'

const emptyState = {
  PrimaryLayout: {},
  pending: {}
}

describe('PrimaryLayout.connector', () => {
  it('should get correct value for returnToURL from state', () => {
    const session = orm.session(orm.getEmptyState())
    const returnToURL = '/anything'
    const state = {
      ...emptyState,
      orm: session.state,
      AuthRoute: { returnToURL }
    }
    expect(mapStateToProps(state, {
      location: { pathname: '' }
    })).toHaveProperty('returnToURL', returnToURL)
  })
})
