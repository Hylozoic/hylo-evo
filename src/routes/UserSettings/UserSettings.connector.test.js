import { mergeProps } from './UserSettings.connector'

describe('mergeProps', () => {
  it("setModified only fires if it's a change", () => {
    const setFullPageModalModified = jest.fn()

    const dispatchProps = {
      setFullPageModalModified
    }

    var { setModified } = mergeProps({modified: false}, dispatchProps, {})

    setModified(false)
    expect(setFullPageModalModified).not.toHaveBeenCalled()
    setModified(true)
    expect(setFullPageModalModified).toHaveBeenCalledWith(true)

    setFullPageModalModified.mockClear()
    setModified = mergeProps({modified: true}, dispatchProps, {}).setModified

    setModified(true)
    expect(setFullPageModalModified).not.toHaveBeenCalled()
    setModified(false)
    expect(setFullPageModalModified).toHaveBeenCalledWith(false)
  })
})
