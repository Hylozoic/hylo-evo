import { mapDispatchToProps } from './AddSkills.connector'

const dispatch = jest.fn(x => x)
const props = {}
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('mapDispatchToProps', () => {
  it('should call addSkill', () => {
    const name = 'My Name'
    expect(dispatchProps.addSkill(name)).toMatchSnapshot()
  })

  it('should call removeSkill', () => {
    const id = 1
    expect(dispatchProps.removeSkill(id)).toMatchSnapshot()
  })
})
