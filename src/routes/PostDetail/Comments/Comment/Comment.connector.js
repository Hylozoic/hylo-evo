import { connect } from 'react-redux'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import updateComment from 'store/actions/updateComment'
import deleteComment from 'store/actions/deleteComment'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { comment } = props
  const currentUser = getMe(state, props)
  const group = getGroupForCurrentRoute(state, props)
  const isCreator = currentUser && (comment.creator.id === currentUser.id)
  const canModerate = currentUser && currentUser.canModerate(group)

  return {
    canModerate,
    isCreator
  }
}

export const mapDispatchToProps = {
  deleteComment,
  updateComment
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { canModerate, isCreator } = stateProps
  const { comment } = ownProps
  const deleteCommentWithConfirm = isCreator
    ? () => window.confirm('Are you sure you want to delete this comment?') &&
      dispatchProps.deleteComment(comment.id)
    : null

  const removeCommentWithConfirm = !isCreator && canModerate
    ? () => window.confirm('Are you sure you want to remove this comment?') &&
    dispatchProps.deleteComment(comment.id)
    : null

  const updateComment = isCreator
    ? text => dispatchProps.updateComment(comment.id, text)
    : null

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteComment: deleteCommentWithConfirm,
    removeComment: removeCommentWithConfirm,
    updateComment
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
