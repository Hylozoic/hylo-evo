import { mapDispatchToProps, mapStateToProps } from './LeftSidebar.connector'

describe('LeftSidebar', () => {
  it('should have match latest snapshot for mapDispatchToProps', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })

  it('should have match latest snapshot for mapStateToProps', () => {
    expect(mapStateToProps).toMatchSnapshot()
  })
})
