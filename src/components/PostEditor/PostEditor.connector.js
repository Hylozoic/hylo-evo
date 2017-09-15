import { get, isEmpty } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { FETCH_POST, UPLOAD_ATTACHMENT } from 'store/constants'
import {
  MODULE_NAME,
  FETCH_LINK_PREVIEW,
  createPost,
  updatePost,
  pollingFetchLinkPreview,
  removeLinkPreview,
  clearLinkPreview,
  getLinkPreview
} from './PostEditor.store'
import {
  addAttachment,
  getAttachments
} from './AttachmentManager/AttachmentManager.store'

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
  const uploadAttachmentPending = state.pending[UPLOAD_ATTACHMENT]
  const images = getAttachments(state, {type: 'image'})
  const files = getAttachments(state, {type: 'file'})
  // TODO: this should be a selector exported from AttachmentManager
  const showImages = !isEmpty(images) ||
    get('attachmentType', uploadAttachmentPending) === 'image'
  const showFiles = !isEmpty(files) ||
    get('attachmentType', uploadAttachmentPending) === 'file'

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
    showImages,
    showFiles,
    images,
    files
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  const slug = getParam('slug', null, props)
  return {
    pollingFetchLinkPreviewRaw: url => pollingFetchLinkPreview(dispatch, url),
    removeLinkPreview: () => dispatch(removeLinkPreview()),
    clearLinkPreview: () => dispatch(clearLinkPreview()),
    updatePost: postParams => dispatch(updatePost(postParams)),
    createPost: postParams => dispatch(createPost(postParams)),
    goToPost: createPostAction => {
      const id = createPostAction.payload.data.createPost.id
      return dispatch(push(postUrl(id, slug)))
    },
    addImage: url => dispatch(addAttachment(url, 'image')),
    addFile: url => dispatch(addAttachment(url, 'file'))
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
