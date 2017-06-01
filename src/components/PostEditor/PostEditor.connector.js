import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import {
  createPost,
  updatePost
} from './PostEditor.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const communityOptions = props.communityOptions || (currentUser &&
    currentUser.memberships.toModelArray().map(m => m.community))
  const editing = !!getParam('postId', state, props)
  let post = props.post || getPost(state, props)
  const loading = editing && !post
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  if (!editing && currentCommunity) {
    post = {communities: [currentCommunity]}
  }
  return {
    post,
    communityOptions,
    currentUser,
    editing,
    loading
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const slug = getParam('slug', null, props)
  return {
    updatePost: (postParams) => dispatch(updatePost(postParams)),
    createPost: (postParams) => dispatch(createPost(postParams)),
    goToPost: (createPostAction) => {
      const id = createPostAction.payload.data.createPost.id
      return dispatch(push(postUrl(id, slug)))
    }
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
