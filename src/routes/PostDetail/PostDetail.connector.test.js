import { mapStateToProps, mapDispatchToProps } from './PostDetail.connector'

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
