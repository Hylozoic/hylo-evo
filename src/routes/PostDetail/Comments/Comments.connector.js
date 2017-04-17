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
    try {
      const post = session.Post.get({id})
      const comments = post.comments
      .orderBy(c => c.id)
      .toModelArray()

      return comments
    } catch (e) {
      return []
    }
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
  const { comments } = stateProps
  const { fetchCommentsMaker } = dispatchProps
  const cursor = !isEmpty(comments) && comments[0].id
  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchComments: fetchCommentsMaker(cursor)
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
