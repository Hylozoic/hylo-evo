import { mapDispatchToProps } from './AddSkills.store'

describe('AddSkills.store', () => {
  it('should match latest snapshot', () => {
    expect(mapDispatchToProps).toMatchSnapshot()
  })
})
