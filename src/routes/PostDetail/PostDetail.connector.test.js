import { mapStateToProps } from './PostDetail.connector'

describe('mapStateToProps', () => {
  it('returns the right keys', () => {
    const state = {
      pending: {}
    }
    const props = {
      match: {}
    }
    expect(mapStateToProps(state, props)).toMatchSnapshot()
  })
})
