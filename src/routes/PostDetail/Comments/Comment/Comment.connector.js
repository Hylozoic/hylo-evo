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
import getResponsibilitiesForGroup from 'store/selectors/getResponsibilitiesForGroup'
import { RESP_MANAGE_CONTENT } from 'store/constants'

export function mapStateToProps (state, props) {
  const { comment, post } = props
  const currentUser = getMe(state, props)
  const group = getGroupForCurrentRoute(state, props)
  const isCreator = currentUser && (comment.creator.id === currentUser.id)
  const responsibilities = group && getResponsibilitiesForGroup({ currentUser, groupId: group.id }).map(r => r.title)
  const canModerate = currentUser && (currentUser.canModerate(group) || responsibilities.includes(RESP_MANAGE_CONTENT))

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

  return {
    ...bindActionCreators({
      deleteComment,
      updateComment
    }, dispatch),
    fetchCommentsMaker: cursor => () => dispatch(fetchChildComments(comment.id, { cursor })),
    createComment: commentParams => dispatch(createComment({
      post: post,
      parentCommentId: comment.id,
      ...commentParams
    }))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchCommentsMaker } = dispatchProps
  const { comment } = ownProps

  const deleteCommentWithConfirm = (commentId, text) => window.confirm(text) &&
      dispatchProps.deleteComment(commentId)

  const removeCommentWithConfirm = (commentId, text) => window.confirm(text) &&
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
