import { get } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { bindActionCreators } from 'redux'
import { postUrl } from 'util/index'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { FETCH_POST } from 'store/constants'
import {
  MODULE_NAME,
  FETCH_LINK_PREVIEW,
  createPost,
  updatePost,
  pollingFetchLinkPreview,
  removeLinkPreview,
  resetLinkPreview,
  setImagePreviews,
  removeImagePreview,
  switchImagePreviews,
  getLinkPreview,
  getImagePreviews
} from './PostEditor.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const communityOptions = props.communityOptions ||
    (currentUser && currentUser.memberships.toModelArray().map(m => m.community))
  let post = props.post || getPost(state, props)
  const loading = !!state.pending[FETCH_POST]
  const editing = !!post || loading
  const linkPreview = getLinkPreview(state, props)
  const linkPreviewStatus = get('linkPreviewStatus', state[MODULE_NAME])
  const fetchLinkPreviewPending = state.pending[FETCH_LINK_PREVIEW]
  const imagePreviews = getImagePreviews(state, props)

  return {
    currentUser,
    currentCommunity,
    communityOptions,
    post,
    loading,
    editing,
    linkPreview,
    linkPreviewStatus,
    fetchLinkPreviewPending,
    imagePreviews
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const slug = getParam('slug', null, props)
  return {
    pollingFetchLinkPreviewRaw: url => pollingFetchLinkPreview(dispatch, url),
    removeLinkPreview: () => dispatch(removeLinkPreview()),
    resetLinkPreview: () => dispatch(resetLinkPreview()),
    updatePost: postParams => dispatch(updatePost(postParams)),
    createPost: postParams => dispatch(createPost(postParams)),
    goToPost: createPostAction => {
      const id = createPostAction.payload.data.createPost.id
      return dispatch(push(postUrl(id, slug)))
    },
    ...bindActionCreators({
      removeImagePreview,
      switchImagePreviews,
      setImagePreviews
    }, dispatch)
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { fetchLinkPreviewPending } = stateProps
  const { pollingFetchLinkPreviewRaw } = dispatchProps

  const pollingFetchLinkPreview = fetchLinkPreviewPending
      ? () => Promise.resolve()
      : url => pollingFetchLinkPreviewRaw(url)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    pollingFetchLinkPreview
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
