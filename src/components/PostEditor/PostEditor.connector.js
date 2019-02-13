import { get, isEmpty } from 'lodash/fp'
import { connect } from 'react-redux'
import { push } from 'react-router-redux'
import { postUrl } from 'util/navigation'
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
  FETCH_POST,
  UPLOAD_ATTACHMENT
} from 'store/constants'
import createPost from 'store/actions/createPost'
import createProject from 'store/actions/createProject'
import updatePost from 'store/actions/updatePost'
import {
  MODULE_NAME,
  FETCH_LINK_PREVIEW,
  pollingFetchLinkPreview,
  removeLinkPreview,
  clearLinkPreview,
  getLinkPreview,
  setAnnouncement
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
  const myModeratedCommunities = (currentUser && communityOptions.filter(c => currentUser.canModerate(c)))
  let post = props.post || presentPost(getPost(state, props))
  const linkPreview = getLinkPreview(state, props)
  const linkPreviewStatus = get('linkPreviewStatus', state[MODULE_NAME])
  const fetchLinkPreviewPending = state.pending[FETCH_LINK_PREVIEW]
  const uploadAttachmentPending = state.pending[UPLOAD_ATTACHMENT]
  const postPending = !!state.pending[CREATE_POST] || !!state.pending[CREATE_PROJECT]
  const loading = !!state.pending[FETCH_POST] || !!uploadAttachmentPending || postPending
  const editing = !!post || loading
  const images = getAttachments(state, {type: 'image'})
  const files = getAttachments(state, {type: 'file'})
  // TODO: this should be a selector exported from AttachmentManager
  const showImages = !isEmpty(images) ||
    get('attachmentType', uploadAttachmentPending) === 'image'
  const showFiles = !isEmpty(files) ||
    get('attachmentType', uploadAttachmentPending) === 'file'
  const communitySlug = getRouteParam('slug', null, props)
  const networkSlug = getRouteParam('networkSlug', null, props)
  const topic = getTopicForCurrentRoute(state, props)
  const topicName = get('name', topic)
  const postTypeContext = getPostTypeContext(null, props) || getQuerystringParam('t', null, props)
  const isProject = postTypeContext === 'project' || get('type', post) === 'project'
  const isEvent = postTypeContext === 'event' || get('type', post) === 'event'  
  const announcementSelected = state[MODULE_NAME].announcement
  const canModerate = currentUser && currentUser.canModerate(currentCommunity)

  return {
    currentUser,
    currentCommunity,
    communityOptions,
    postTypeContext,
    isProject,
    isEvent,
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
    communitySlug,
    networkSlug,
    announcementSelected,
    canModerate,
    myModeratedCommunities
  }
}

export const mapDispatchToProps = (dispatch, props) => {
  return {
    pollingFetchLinkPreviewRaw: url => pollingFetchLinkPreview(dispatch, url),
    removeLinkPreview: () => dispatch(removeLinkPreview()),
    clearLinkPreview: () => dispatch(clearLinkPreview()),
    updatePost: postParams => dispatch(updatePost(postParams)),
    createPost: postParams => dispatch(createPost(postParams)),
    createProject: postParams => dispatch(createProject(postParams)),
    goToUrl: url => dispatch(push(url)),
    addImage: url => dispatch(addAttachment(url, 'image')),
    addFile: url => dispatch(addAttachment(url, 'file')),
    setAnnouncement: bool => dispatch(setAnnouncement(bool))
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { fetchLinkPreviewPending, topicName, communitySlug, networkSlug, postTypeContext } = stateProps
  const { pollingFetchLinkPreviewRaw, goToUrl } = dispatchProps
  const goToPost = createPostAction => {
    const id = get('payload.data.createPost.id', createPostAction) || get('payload.data.createProject.id', createPostAction)
    const url = postUrl(id, {communitySlug, networkSlug, postTypeContext, topicName})

    return goToUrl(url)
  }
  const pollingFetchLinkPreview = fetchLinkPreviewPending
      ? () => Promise.resolve()
      : url => pollingFetchLinkPreviewRaw(url)
  const createPost = postParams => dispatchProps.createPost({networkSlug, ...postParams})
  const createProject = projectParams => dispatchProps.createProject({networkSlug, ...projectParams})

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToPost,
    pollingFetchLinkPreview,
    createPost,
    createProject
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
