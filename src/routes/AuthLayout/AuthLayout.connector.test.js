import { mapStateToProps } from './AuthLayout.connector'

const emptyState = {
  AuthLayout: {},
  pending: {}
}

describe('AuthLayout.connector', () => {
  it('should get correct value for returnToURL from state', () => {
    const returnToURL = '/anything'
    const state = {
      ...emptyState,
      AuthRoute: { returnToURL }
    }
    expect(mapStateToProps(state, {})).toHaveProperty('returnToURL', returnToURL)
  })
})
