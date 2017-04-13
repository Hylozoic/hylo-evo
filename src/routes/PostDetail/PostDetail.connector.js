import { connect } from 'react-redux'
import { fetchPost } from './actions'
import { createSelector } from 'reselect'
import getParam from 'store/selectors/getParam'
import orm from 'store/models'

export const getPost = createSelector(
  state => state,
  state => orm.session(state.orm),
  (state, props) => getParam('postId', state, props),
  (state, session, id) => {
    try {
      // console.log('trying to get post with id', id)
      const post = session.Post.get({id})
      return {
        ...post.ref,
        creator: post.creator,
        commenters: post.commenters.toModelArray(),
        communities: post.communities.toModelArray()
      }
    } catch (e) {
      return null
    }
  })

export function mapStateToProps (state, props) {
  return {
    post: getPost(state, props),
    slug: 'hylo'
  }
}

export const mapDispatchToProps = (dispatch, { match: { params: { postId } } }) => {
  return {
    fetchPost: () => dispatch(fetchPost(postId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
