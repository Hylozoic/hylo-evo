import { mapDispatchToProps } from './UploadPhoto.connector'
describe('Upload Photo', () => {
  it('should call updateUserSettings', () => {
    const dispatch = jest.fn(x => x)
    const props = {}
    const name = 'My Name'
    const dispatchProps = mapDispatchToProps(dispatch, props)
    expect(dispatchProps.updateUserSettings(name)).toMatchSnapshot()
  })
})
