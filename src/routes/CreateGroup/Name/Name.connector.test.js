import { mapDispatchToProps, mapStateToProps } from './Name.connector'

const dispatch = jest.fn(x => x)
const props = { match: { params: { } } }
const dispatchProps = mapDispatchToProps(dispatch, props)

describe('Domain', () => {
  it('should call fetchGroup from mapDispatchToProps', () => {
    const groupName = 'Group Name'
    expect(dispatchProps.addGroupName(groupName)).toMatchSnapshot()
  })

  it('should call goToNextStep from mapDispatchToProps', () => {
    expect(dispatchProps.goToNextStep()).toMatchSnapshot()
  })

  it('should call goHome from mapDispatchToProps', () => {
    expect(dispatchProps.goHome()).toMatchSnapshot()
  })

  it('should have groupName in mapStateToProps', () => {
    const groupName = 'groupName'
    const state = {
      CreateGroup: {
        name: groupName
      }
    }
    expect(mapStateToProps(state, props).groupName).toBe(groupName)
  })
})
