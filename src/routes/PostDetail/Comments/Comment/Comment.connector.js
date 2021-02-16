import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { isEmpty } from 'lodash/fp'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import createComment from 'store/actions/createComment'
import updateComment from 'store/actions/updateComment'
import deleteComment from 'store/actions/deleteComment'
import fetchChildComments from 'store/actions/fetchChildComments'
import { getHasMoreChildComments, getTotalChildComments } from 'store/selectors/getChildComments'
import getMe from 'store/selectors/getMe'

export function mapStateToProps (state, props) {
  const { comment } = props
  const currentUser = getMe(state, props)
  const group = getGroupForCurrentRoute(state, props)
  const isCreator = currentUser && (comment.creator.id === currentUser.id)
  const canModerate = currentUser && currentUser.canModerate(group)
  console.log("comment connector!", comment)
  return {
    childCommentsTotal: getTotalChildComments(state, { id: comment.id }),
    hasMoreChildComments: getHasMoreChildComments(state, { id: comment.id }),
    canModerate,
    isCreator
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const { postId, comment } = props
  return {
    ...bindActionCreators({
      deleteComment,
      updateComment
    }, dispatch),
    fetchCommentsMaker: cursor => () => dispatch(fetchChildComments(comment.id, { cursor })),
    createComment: commentParams => dispatch(createComment({
      postId,
      parentCommentId: comment.id,
      ...commentParams
    }))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { canModerate, isCreator } = stateProps
  const { fetchCommentsMaker } = dispatchProps
  const { comment } = ownProps

  const deleteCommentWithConfirm = isCreator
    ? (commentId) => window.confirm('Are you sure you want to delete this comment?') &&
      dispatchProps.deleteComment(commentId)
    : null

  const removeCommentWithConfirm = !isCreator && canModerate
    ? (commentId) => window.confirm('Are you sure you want to remove this comment?') &&
      dispatchProps.deleteComment(commentId)
    : null

  const updateComment = isCreator
    ? (commentId, text) => dispatchProps.updateComment(commentId, text)
    : null

  const cursor = !isEmpty(comment.childComments) && comment.childComments[0].id
  const fetchChildComments = fetchCommentsMaker(cursor)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    deleteComment: deleteCommentWithConfirm,
    removeComment: removeCommentWithConfirm,
    updateComment,
    fetchChildComments
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
