import { mapDispatchToProps } from './AddLocation.connector'
describe('AddLocation', () => {
  it('should call updateUserSettings', () => {
    const dispatch = jest.fn(x => x)
    const props = {}
    const name = 'My Name'
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.updateUserSettings(name)).toMatchSnapshot()
  })
})
