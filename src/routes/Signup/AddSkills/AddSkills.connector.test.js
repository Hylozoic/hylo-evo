import { mapDispatchToProps, mapStateToProps } from './AddSkills.connector'

describe('AddSkills.connector', () => {
  it('should match latest snapshot for mapDispatchToProps', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
  it('should match latest snapshot for mapStateToProps', () => {
    expect(mapStateToProps).toMatchSnapshot()
  })
})
