import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import fetchPost from 'store/actions/fetchPost'
import {
  createPost,
  updatePost
} from './PostEditor.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const communityOptions = currentUser &&
    currentUser.memberships.toModelArray().map(m => m.community)
  const post = props.post || getPost(state, props)
  const editing = !!getParam('postId', state, props)
  const loading = editing && !post
  return {
    post,
    communityOptions,
    loading,
    editing
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    fetchPost: () => dispatch(fetchPost(getParam('postId', {}, props))),
    createPost: (postParams) => dispatch(createPost(postParams)),
    updatePost: (postParams) => dispatch(updatePost(postParams))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
