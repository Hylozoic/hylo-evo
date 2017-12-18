import { mapStateToProps } from './Login.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {}
    const props = {
      match: {}
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})
