import { connect } from 'react-redux'
import getMe from 'store/selectors/getMe'
import { isEmpty } from 'lodash/fp'
import fetchComments from 'store/actions/fetchComments'
import {
  getComments,
  getHasMoreComments,
  getTotalComments
} from 'store/selectors/getComments'
import createComment from 'store/actions/createComment'
import { FETCH_COMMENTS } from 'store/constants'

export function mapStateToProps (state, props) {
  const comments = getComments(state, props)
  const commentsPending = state.pending[FETCH_COMMENTS]

  return {
    commentsPending,
    comments,
    total: getTotalComments(state, { id: props.postId }),
    hasMore: getHasMoreComments(state, { id: props.postId }),
    currentUser: getMe(state)
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const { postId, scrollToBottom } = props
  return {
    fetchCommentsMaker: cursor => () => dispatch(fetchComments(postId, { cursor })),
    createComment: async commentParams => {
      await dispatch(createComment({ postId, ...commentParams }))
      scrollToBottom()
    }
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { comments } = stateProps
  const { fetchCommentsMaker } = dispatchProps
  const cursor = !isEmpty(comments) && comments[0].id
  const fetchComments = fetchCommentsMaker(cursor)
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchComments
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
