import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import { getPost } from 'routes/PostDetail/PostDetail.connector'
import { fetchPost } from 'routes/PostDetail/PostDetail.store'
import { createPost } from './PostEditor.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const communityOptions = currentUser &&
    currentUser.memberships.toModelArray().map(m => m.community)
  const post = getPost(state, props)
  return {
    post,
    communityOptions
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchPost: () => dispatch(fetchPost(getParam('postId', {}, props))),
    createPost: (postParams) => dispatch(createPost(postParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
