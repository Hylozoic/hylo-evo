import { get, isEmpty } from 'lodash/fp'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import { postUrl } from 'util/navigation'
import isPendingFor from 'store/selectors/isPendingFor'
import getRouteParam from 'store/selectors/getRouteParam'
import getPostTypeContext from 'store/selectors/getPostTypeContext'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import presentPost from 'store/presenters/presentPost'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import {
  CREATE_POST,
  CREATE_PROJECT,
  FETCH_POST
} from 'store/constants'
import createPost from 'store/actions/createPost'
import createProject from 'store/actions/createProject'
import updatePost from 'store/actions/updatePost'
import { fetchDefaultTopics } from 'store/actions/fetchTopics'
import {
  addAttachment,
  getAttachments,
  getUploadAttachmentPending
} from 'components/AttachmentManager/AttachmentManager.store'
import {
  MODULE_NAME,
  FETCH_LINK_PREVIEW,
  pollingFetchLinkPreview,
  removeLinkPreview,
  clearLinkPreview,
  getDefaultTopics,
  getLinkPreview,
  setAnnouncement
} from './PostEditor.store'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const currentCommunity = getCommunityForCurrentRoute(state, props)
  const communityOptions = props.communityOptions ||
    (currentUser && currentUser.memberships.toModelArray().map((m) => m.community))
  const myModeratedCommunities = (currentUser && communityOptions.filter(c => currentUser.canModerate(c)))
  let post = props.post || presentPost(getPost(state, props))
  const linkPreview = getLinkPreview(state, props)
  const linkPreviewStatus = get('linkPreviewStatus', state[MODULE_NAME])
  const fetchLinkPreviewPending = isPendingFor(FETCH_LINK_PREVIEW, state)
  const uploadAttachmentPending = getUploadAttachmentPending(state)
  const editingPostId = getRouteParam('postId', state, props)
  const uploadFileAttachmentPending = getUploadAttachmentPending(state, { type: 'post', id: editingPostId, attachmentType: 'file' })
  const uploadImageAttachmentPending = getUploadAttachmentPending(state, { type: 'post', id: editingPostId, attachmentType: 'image' })
  const postPending = isPendingFor([CREATE_POST, CREATE_PROJECT], state)
  const loading = isPendingFor(FETCH_POST, state) || !!uploadAttachmentPending || !!fetchLinkPreviewPending || postPending
  const editing = !!post || loading
  const imageAttachments = getAttachments(state, { type: 'post', id: editingPostId, attachmentType: 'image' })
  const fileAttachments = getAttachments(state, { type: 'post', id: editingPostId, attachmentType: 'file' })
  const showImages = !isEmpty(imageAttachments) || uploadImageAttachmentPending
  const showFiles = !isEmpty(fileAttachments) || uploadFileAttachmentPending
  const communitySlug = getRouteParam('slug', null, props)
  const networkSlug = getRouteParam('networkSlug', null, props)
  const topic = getTopicForCurrentRoute(state, props)
  const topicName = get('name', topic)
  const postTypeContext = getPostTypeContext(null, props) || getQuerystringParam('t', null, props)
  const isProject = postTypeContext === 'project' || get('type', post) === 'project'
  const isEvent = postTypeContext === 'event' || get('type', post) === 'event'
  const announcementSelected = state[MODULE_NAME].announcement
  const canModerate = currentUser && currentUser.canModerate(currentCommunity)
  const defaultTopics = getDefaultTopics(state, { communitySlug: communitySlug, sortBy: 'name' })

  return {
    currentUser,
    currentCommunity,
    communityOptions,
    defaultTopics,
    postTypeContext,
    isProject,
    isEvent,
    editingPostId,
    post,
    imageAttachments,
    fileAttachments,
    showImages,
    showFiles,
    loading,
    postPending,
    editing,
    linkPreview,
    linkPreviewStatus,
    fetchLinkPreviewPending,
    topic,
    topicName,
    communitySlug,
    networkSlug,
    announcementSelected,
    canModerate,
    myModeratedCommunities,
    uploadFileAttachmentPending,
    uploadImageAttachmentPending
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    pollingFetchLinkPreviewRaw: url => pollingFetchLinkPreview(dispatch, url),
    goToUrl: url => dispatch(push(url)),
    ...bindActionCreators({
      fetchDefaultTopics,
      setAnnouncement,
      removeLinkPreview,
      clearLinkPreview,
      updatePost,
      createPost,
      createProject,
      addAttachment
    }, dispatch)
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const {
    fetchLinkPreviewPending, topicName, communitySlug, networkSlug, postTypeContext
  } = stateProps
  const { pollingFetchLinkPreviewRaw, goToUrl } = dispatchProps
  const goToPost = createPostAction => {
    const id = get('payload.data.createPost.id', createPostAction) ||
      get('payload.data.createProject.id', createPostAction)
    const url = postUrl(id, { communitySlug, networkSlug, postTypeContext, topicName })

    return goToUrl(url)
  }
  const pollingFetchLinkPreview = fetchLinkPreviewPending
    ? () => Promise.resolve()
    : url => pollingFetchLinkPreviewRaw(url)
  const createPost = postParams =>
    dispatchProps.createPost({ networkSlug, ...postParams })
  const createProject = projectParams =>
    dispatchProps.createProject({ networkSlug, ...projectParams })
  const fetchDefaultTopics = () => dispatchProps.fetchDefaultTopics({ networkSlug, communitySlug })

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    createPost,
    createProject,
    fetchDefaultTopics,
    goToPost,
    pollingFetchLinkPreview
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
