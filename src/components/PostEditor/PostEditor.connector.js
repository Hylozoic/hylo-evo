import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import {
  MODULE_NAME,
  FETCH_LINK_PREVIEW,
  createPost,
  updatePost,
  fetchLinkPreview,
  removeLinkPreview,
  resetLinkPreview,
  getLinkPreview
} from './PostEditor.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const communityOptions = props.communityOptions || (currentUser &&
    currentUser.memberships.toModelArray().map(m => m.community))
  let post = props.post || getPost(state, props)
  const editing = !!post
  const loading = editing && !post.id
  // LEJ: the defaultPost assembled here is merged with on top of
  // defaultProps.post on the component
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const defaultPost = (!editing && currentCommunity)
    ? {communities: [currentCommunity]}
    : {}
  // LEJ: linkPreviewIdOrStatus is an id or status (currently rejected
  // or removed). The post.linkPreview is replaced with either the new
  // LinkPreview or cleared with null for either status.
  const fetchLinkPreviewPending = state.pending[FETCH_LINK_PREVIEW]
  const { linkPreviewIdOrStatus } = state[MODULE_NAME]
  if (linkPreviewIdOrStatus) {
    post.linkPreview = getLinkPreview(state, props)
  }
  return {
    post,
    defaultPost,
    fetchLinkPreviewPending,
    linkPreviewIdOrStatus,
    communityOptions,
    currentUser,
    editing,
    loading
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const slug = getParam('slug', null, props)
  return {
    fetchLinkPreviewRaw: url => dispatch(fetchLinkPreview(url)),
    removeLinkPreview: () => dispatch(removeLinkPreview()),
    resetLinkPreview: () => dispatch(resetLinkPreview()),
    updatePost: postParams => dispatch(updatePost(postParams)),
    createPost: postParams => dispatch(createPost(postParams)),
    goToPost: createPostAction => {
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
