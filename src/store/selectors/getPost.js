import { createSelector } from 'reselect'
import orm from 'store/models'
import getParam from 'store/selectors/getParam'

const getPost = createSelector(
  state => state,
  state => orm.session(state.orm),
  (state, props) => getParam('postId', state, props),
  (state, session, id) => {
    try {
      const post = session.Post.get({id})
      return {
        ...post.ref,
        creator: post.creator,
        linkPreview: post.linkPreview,
        commenters: post.commenters.toModelArray(),
        communities: post.communities.toModelArray()
      }
    } catch (e) {
      return null
    }
  }
)

export default getPost
