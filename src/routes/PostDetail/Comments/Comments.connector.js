import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import { createSelector } from 'reselect'
import { getMe } from 'store/selectors/getMe'
import orm from 'store/models'
import { getPost } from 'routes/PostDetail/PostDetail.connector.js'
import getParam from 'store/selectors/getParam'

// const getComments = createSelector(
//   state => orm.session(state.orm),
//   (state, props) => getParam('postId', state, props),
//   (session, id) => {
//     try {
//       const post = session.Post.get({id})
//       return post.comments.toModelArray()
//       .map(comment => ({
//         ...comment.ref,
//         creator: comment.creator
//       }))
//     } catch (e) {
//       return []
//     }
//   })

const getComments = () => []

export function mapStateToProps (state, props) {
  return {
    comments: getComments(state, props),
    commentsTotal: get('commentsTotal', getPost(state, props)),
    fetchComments: () => console.log('Fetch more comments'),
    createComment: params => console.log('creating comment', params),
    slug: 'hylo',
    currentUser: getMe(state.orm)
  }
}

export const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)
