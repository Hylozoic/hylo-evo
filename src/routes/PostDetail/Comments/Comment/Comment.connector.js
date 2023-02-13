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
  const { comment, post } = props
  const currentUser = getMe(state, props)
  const group = getGroupForCurrentRoute(state, props)
  const isCreator = currentUser && (comment.creator.id === currentUser.id)
  const canModerate = currentUser && currentUser.canModerate(group)

  return {
    canModerate,
    childCommentsTotal: getTotalChildComments(state, { id: comment.id }),
    currentUser,
    hasMoreChildComments: getHasMoreChildComments(state, { id: comment.id }),
    isCreator,
    post
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const { post, comment } = props

  const groupIds = post.groups.map(g => g.id)

  return {
    ...bindActionCreators({
      deleteComment,
      updateComment
    }, dispatch),
    fetchCommentsMaker: cursor => () => dispatch(fetchChildComments(comment.id, { cursor })),
    createComment: commentParams => dispatch(createComment({
      groupIds,
      postId: post.id,
      parentCommentId: comment.id,
      ...commentParams
    }))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchCommentsMaker } = dispatchProps
  const { comment } = ownProps

  const deleteCommentWithConfirm = (commentId) => window.confirm('Are you sure you want to delete this comment?') &&
      dispatchProps.deleteComment(commentId)

  const removeCommentWithConfirm = (commentId) => window.confirm('Are you sure you want to remove this comment?') &&
      dispatchProps.deleteComment(commentId)

  const updateComment = (commentId, text) => dispatchProps.updateComment(commentId, text)

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
