import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { isEmpty } from 'lodash/fp'
import { fetchComments, createComment, getComments, getHasMoreComments, getTotalComments } from './Comments.store'
import getHolochainActive from 'store/selectors/getHolochainActive'

export function mapStateToProps (state, props) {
  return {
    comments: getComments(state, props),
    total: getTotalComments(state, { id: props.postId }),
    hasMore: getHasMoreComments(state, { id: props.postId }),
    currentUser: getMe(state),
    holochainActive: getHolochainActive(state)
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const { postId, scrollToBottom } = props
  return {
    fetchCommentsMaker: (cursor, holochainApi) => () => dispatch(fetchComments(postId, { cursor }, holochainApi)),
    createCommentMaker: holochainApi => text =>
      dispatch(createComment(postId, text, holochainApi))
        .then(() => scrollToBottom())
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { comments, holochainActive } = stateProps
  const { fetchCommentsMaker, createCommentMaker } = dispatchProps
  const cursor = !isEmpty(comments) && comments[0].id

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchComments: fetchCommentsMaker(cursor, holochainActive),
    createComment: createCommentMaker(holochainActive)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
