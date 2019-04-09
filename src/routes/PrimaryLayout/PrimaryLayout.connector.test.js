import { mapStateToProps } from './PrimaryLayout.connector'

const emptyState = {
  PrimaryLayout: {},
  pending: {},
  holochain: {}
}

describe('PrimaryLayout.connector', () => {
  it('should get correct value for returnToURL from state', () => {
    const returnToURL = '/anything'
    const state = {
      ...emptyState,
      AuthRoute: { returnToURL }
    }
    expect(mapStateToProps(state, {})).toHaveProperty('returnToURL', returnToURL)
  })
})
