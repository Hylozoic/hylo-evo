import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getMe } from 'store/selectors/getMe'
import { isEmpty } from 'lodash/fp'
import orm from 'store/models'
import { fetchComments, createComment } from './Comments.store'

const getCommentsAndTotal = createSelector(
  state => orm.session(state.orm),
  (state, props) => props.postId,
  (session, id) => {
    try {
      const post = session.Post.get({id})
      const comments = post.comments.toModelArray()
      .map(comment => ({
        ...comment.ref,
        creator: comment.creator
      }))
      .reverse()
      // reversed because they're returned in descending order

      return {
        comments,
        commentsTotal: post.commentsTotal
      }
    } catch (e) {
      return {
        comments: [],
        commentsTotal: null
      }
    }
  })

export function mapStateToProps (state, props) {
  const { comments, commentsTotal } = getCommentsAndTotal(state, props)
  return {
    comments,
    commentsTotal,
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
