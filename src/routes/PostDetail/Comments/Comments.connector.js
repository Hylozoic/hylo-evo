import { isEmpty } from 'lodash/fp'
import { connect } from 'react-redux'
import createComment from 'store/actions/createComment'
import fetchComments from 'store/actions/fetchComments'
import { FETCH_COMMENTS } from 'store/constants'
import {
  getComments,
  getHasMoreComments,
  getTotalComments
} from 'store/selectors/getComments'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'

export function mapStateToProps (state, props) {
  const comments = getComments(state, props)
  const commentsPending = state.pending[FETCH_COMMENTS]

  return {
    commentsPending,
    comments,
    currentUser: getMe(state),
    hasMore: getHasMoreComments(state, { id: props.post.id }),
    total: getTotalComments(state, { id: props.post.id })
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const { post, scrollToBottom } = props

  return {
    fetchCommentsMaker: cursor => () => dispatch(fetchComments(post.id, { cursor })),
    createComment: async commentParams => {
      await dispatch(createComment({ post, ...commentParams }))
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
