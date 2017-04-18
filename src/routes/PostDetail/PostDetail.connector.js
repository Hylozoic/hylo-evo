import { connect } from 'react-redux'
import { fetchPost } from './PostDetail.store'
import { createSelector } from 'reselect'
import getParam from 'store/selectors/getParam'
import orm from 'store/models'
import { push } from 'react-router-redux'

export const getPost = createSelector(
  state => state,
  state => orm.session(state.orm),
  (state, props) => getParam('postId', state, props),
  (state, session, id) => {
    try {
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

export const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchPost: () => dispatch(fetchPost(getParam('postId', {}, props))),
    navigate: to => dispatch(push(to))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
