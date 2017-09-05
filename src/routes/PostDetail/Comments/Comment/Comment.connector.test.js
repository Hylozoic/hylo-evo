import { mergeProps } from './Comment.connector'

describe('mergeProps', () => {
  it('returns null for deleteComment when canModerate is false', () => {
    const stateProps = {canModerate: false}
    const props = mergeProps(stateProps, {}, {})
    expect(props.deleteComment).toBeNull()
  })

  it('returns a function for deleteComment when canModerate is true', () => {
    window.confirm = jest.fn()
    const stateProps = {canModerate: true}
    const props = mergeProps(stateProps, {}, {})
    props.deleteComment(1)
    expect(window.confirm).toHaveBeenCalledWith('Are you sure you want to delete this comment?')
  })
})
