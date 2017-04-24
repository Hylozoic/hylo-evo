import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getMe } from 'store/selectors/getMe'
import { isEmpty } from 'lodash/fp'
import orm from 'store/models'
import { fetchComments, createComment, getHasMoreComments, getTotalComments } from './Comments.store'

export const getComments = createSelector(
  state => orm.session(state.orm),
  (state, props) => props.postId,
  (session, id) => {
    var post
    try {
      post = session.Post.get({id})
    } catch (e) {
      return []
    }
    return post.comments.orderBy(c => c.id).toModelArray()
  })

export function mapStateToProps (state, props) {
  return {
    comments: getComments(state, props),
    total: getTotalComments(state, {id: props.postId}),
    hasMore: getHasMoreComments(state, {id: props.postId}),
    slug: 'hylo',
    currentUser: getMe(state)
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchCommentsMaker: cursor => () => dispatch(fetchComments(props.postId, {cursor})),
    createComment: (postId, text) => dispatch(createComment(postId, text))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { scrollToBottom } = ownProps
  const { comments } = stateProps
  const { fetchCommentsMaker, createComment } = dispatchProps
  const cursor = !isEmpty(comments) && comments[0].id
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    createComment: (postId, text) => {
      createComment(postId, text)
      .then(() => scrollToBottom())
    },
    fetchComments: fetchCommentsMaker(cursor)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
