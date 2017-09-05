import { connect } from 'react-redux'
import { deleteComment, getCommunity } from './Comment.store'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { comment } = props
  const currentUser = getMe(state, props)
  const community = getCommunity(state, props)
  const canModerate = comment.creator.id === currentUser.id ||
    currentUser.canModerate(community)

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
