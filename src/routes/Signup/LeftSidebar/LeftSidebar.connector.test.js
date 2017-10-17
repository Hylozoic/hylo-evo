import { mapDispatchToProps, mergeProps } from './LeftSidebar.connector'

test('updateUserSettings > mapDispatchToProps should match snapshot', () => {
  const dispatch = jest.fn(x => x)
  const props = {}
  const name = 'My Name'
  const dispatchProps = mapDispatchToProps(dispatch, props)
  expect(dispatchProps.updateUserSettings(name)).toMatchSnapshot()
})

test('mergeProps > handleCloseSignupModal', () => {
  const stateProps = {
    returnToURL: '/anything'
  }
  const dispatchProps = {
    updateUserSettings: jest.fn(() => Promise.resolve()),
    resetReturnToURL: jest.fn(),
    push: jest.fn()
  }
  const result = mergeProps(stateProps, dispatchProps)
  expect.assertions(3)
  return result.handleCloseSignupModal().then(() => {
    expect(dispatchProps.updateUserSettings).toHaveBeenCalled()
    expect(dispatchProps.resetReturnToURL).toHaveBeenCalled()
    return expect(dispatchProps.push).toHaveBeenCalledWith(stateProps.returnToURL)
  })
})
