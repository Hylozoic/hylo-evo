import { mapDispatchToProps, mapStateToProps } from './Review.connector'

describe('Review.connector', () => {
  it('should match latest snapshot for mapDispatchToProps', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
  it('should match latest snapshot for mapStateToProps', () => {
    expect(mapStateToProps).toMatchSnapshot()
  })
})
