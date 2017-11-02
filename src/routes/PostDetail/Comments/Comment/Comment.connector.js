import { connect } from 'react-redux'
import { deleteComment } from './Comment.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { comment } = props
  const currentUser = getMe(state, props)
  const community = getCommunityForCurrentRoute(state, props)
  const isCreator = currentUser && (comment.creator.id === currentUser.id)
  const canModerate = currentUser && currentUser.canModerate(community)

  return {
    canModerate,
    isCreator
  }
}

export const mapDispatchToProps = {
  deleteComment
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

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteComment: deleteCommentWithConfirm,
    removeComment: removeCommentWithConfirm
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
