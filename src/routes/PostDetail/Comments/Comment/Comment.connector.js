import { connect } from 'react-redux'
import { deleteComment } from './Comment.store'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { comment } = props
  const currentUser = getMe(state, props)
  const community = getCommunityForCurrentRoute(state, props)
  const canModerate = currentUser && (comment.creator.id === currentUser.id ||
    currentUser.canModerate(community))

  return {
    canModerate
  }
}

export const mapDispatchToProps = {
  deleteComment
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { canModerate } = stateProps
  const { comment } = ownProps
  const deleteCommentWithConfirm = canModerate
    ? () => window.confirm('Are you sure you want to delete this comment?') &&
      dispatchProps.deleteComment(comment.id)
    : null
  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteComment: deleteCommentWithConfirm
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
