import { connect } from 'react-redux'
import { createSelector } from 'reselect'
import { getMe } from 'store/selectors/getMe'
import orm from 'store/models'

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
    fetchComments: () => console.log('Fetch more comments'),
    createComment: params => console.log('creating comment', params),
    slug: 'hylo',
    currentUser: getMe(state.orm)
  }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)
