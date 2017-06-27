import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import {
  createPost,
  updatePost,
  FETCH_LINK_PREVIEW,
  fetchLinkPreview,
  clearLinkPreview,
  getLinkPreview
} from './PostEditor.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const communityOptions = props.communityOptions || (currentUser &&
    currentUser.memberships.toModelArray().map(m => m.community))
  const linkPreview = getLinkPreview(state, props)
  const fetchLinkPreviewPending = state.pending[FETCH_LINK_PREVIEW]
  const editing = !!getParam('postId', state, props)
  let post = props.post || getPost(state, props)
  const loading = editing && !post
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  if (!editing && currentCommunity) {
    post = {communities: [currentCommunity]}
  }

  return {
    post,
    linkPreview,
    communityOptions,
    currentUser,
    editing,
    loading,
    fetchLinkPreviewPending
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const slug = getParam('slug', null, props)
  return {
    fetchLinkPreviewRaw: (url) => dispatch(fetchLinkPreview(url)),
    clearLinkPreview: () => dispatch(clearLinkPreview()),
    updatePost: (postParams) => dispatch(updatePost(postParams)),
    createPost: (postParams) => dispatch(createPost(postParams)),
    goToPost: (createPostAction) => {
      const id = createPostAction.payload.data.createPost.id
      return dispatch(push(postUrl(id, slug)))
    }
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { fetchLinkPreviewPending } = stateProps
  const { fetchLinkPreviewRaw } = dispatchProps

  const fetchLinkPreview = fetchLinkPreviewPending
    ? () => Promise.resolve()
    : url => fetchLinkPreviewRaw(url)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchLinkPreview
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
