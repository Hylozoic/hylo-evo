import { mapDispatchToProps, mergeProps } from './LeftSidebar.connector'

test('mapDispatchToProps', () => {
  expect(mapDispatchToProps).toMatchSnapshot()
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
