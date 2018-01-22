import { get, isEmpty } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/index'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getPost, { presentPost } from 'store/selectors/getPost'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { FETCH_POST, UPLOAD_ATTACHMENT } from 'store/constants'
import {
  CREATE_POST,
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
  let post = props.post || presentPost(getPost(state, props))
  const linkPreview = getLinkPreview(state, props)
  const linkPreviewStatus = get('linkPreviewStatus', state[MODULE_NAME])
  const fetchLinkPreviewPending = state.pending[FETCH_LINK_PREVIEW]
  const uploadAttachmentPending = state.pending[UPLOAD_ATTACHMENT]
  const postPending = !!state.pending[CREATE_POST]
  const loading = !!state.pending[FETCH_POST] || !!uploadAttachmentPending || postPending
  const editing = !!post || loading
  const images = getAttachments(state, {type: 'image'})
  const files = getAttachments(state, {type: 'file'})
  // TODO: this should be a selector exported from AttachmentManager
  const showImages = !isEmpty(images) ||
    get('attachmentType', uploadAttachmentPending) === 'image'
  const showFiles = !isEmpty(files) ||
    get('attachmentType', uploadAttachmentPending) === 'file'

  const slug = getParam('slug', null, props)
  const topic = getTopicForCurrentRoute(state, props)
  const topicName = get('name', topic)

  return {
    currentUser,
    currentCommunity,
    communityOptions,
    post,
    loading,
    postPending,
    editing,
    linkPreview,
    linkPreviewStatus,
    fetchLinkPreviewPending,
    showImages,
    showFiles,
    images,
    files,
    topic,
    topicName,
    slug
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    pollingFetchLinkPreviewRaw: url => pollingFetchLinkPreview(dispatch, url),
    removeLinkPreview: () => dispatch(removeLinkPreview()),
    clearLinkPreview: () => dispatch(clearLinkPreview()),
    updatePost: postParams => dispatch(updatePost(postParams)),
    createPost: (postParams, topic) => dispatch(createPost(postParams, topic)),
    goToUrl: url => dispatch(push(url)),
    addImage: url => dispatch(addAttachment(url, 'image')),
    addFile: url => dispatch(addAttachment(url, 'file'))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { fetchLinkPreviewPending, topicName, slug, topic } = stateProps
  const { pollingFetchLinkPreviewRaw, goToUrl } = dispatchProps

  const goToPost = createPostAction => {
    const id = createPostAction.payload.data.createPost.id
    const url = topicName
      ? postUrl(id, slug, {topicName})
      : postUrl(id, slug)
    return goToUrl(url)
  }

  const pollingFetchLinkPreview = fetchLinkPreviewPending
      ? () => Promise.resolve()
      : url => pollingFetchLinkPreviewRaw(url)

  const createPost = postParams => dispatchProps.createPost(postParams, topic)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToPost,
    pollingFetchLinkPreview,
    createPost
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
