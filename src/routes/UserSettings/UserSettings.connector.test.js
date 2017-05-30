import { mergeProps } from './UserSettings.connector'

describe('mergeProps', () => {
  it("setConfirm only fires if it's a change", () => {
    const setConfirmBeforeClose = jest.fn()

    const dispatchProps = {
      setConfirmBeforeClose
    }

    var { setConfirm } = mergeProps({modified: false}, dispatchProps, {})

    setConfirm(false)
    expect(setConfirmBeforeClose).not.toHaveBeenCalled()
    setConfirm('message')
    expect(setConfirmBeforeClose).toHaveBeenCalledWith('message')

    setConfirmBeforeClose.mockClear()
    setConfirm = mergeProps({modified: true}, dispatchProps, {}).setConfirm

    setConfirm('message')
    expect(setConfirmBeforeClose).not.toHaveBeenCalled()
    setConfirm(false)
    expect(setConfirmBeforeClose).toHaveBeenCalledWith(false)
  })
})
