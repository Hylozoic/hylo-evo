import { get, isEmpty } from 'lodash/fp'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'
import { push, replace } from 'connected-react-router'
import { postUrl } from 'util/navigation'
import isPendingFor from 'store/selectors/isPendingFor'
import getRouteParam from 'store/selectors/getRouteParam'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import getMe from 'store/selectors/getMe'
import getPost from 'store/selectors/getPost'
import presentPost from 'store/presenters/presentPost'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import hasResponsibilityForGroup from 'store/selectors/hasResponsibilityForGroup'
import { fetchLocation, ensureLocationIdIfCoordinate } from 'components/LocationInput/LocationInput.store'
import {
  CREATE_POST,
  CREATE_PROJECT,
  FETCH_POST,
  RESP_ADMINISTRATION
} from 'store/constants'
import createPost from 'store/actions/createPost'
import updatePost from 'store/actions/updatePost'
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
  getLinkPreview,
  setAnnouncement
} from './PostEditor.store'
import { MAX_TITLE_LENGTH } from './PostEditor'

export function mapStateToProps (state, props) {
  const currentUser = getMe(state)
  const currentGroup = getGroupForCurrentRoute(state, props)
  const groupOptions = props.groupOptions ||
    (currentUser && currentUser.memberships.toModelArray().map((m) => m.group).sort((a, b) => a.name.localeCompare(b.name)))
  const myAdminGroups = (currentUser && groupOptions.filter(g => hasResponsibilityForGroup(state, { person: currentUser, groupId: g.id, responsibility: RESP_ADMINISTRATION })))
  // TODO RESP: verify this works as expected
  const linkPreview = getLinkPreview(state, props)
  const linkPreviewStatus = get('linkPreviewStatus', state[MODULE_NAME])
  const fetchLinkPreviewPending = isPendingFor(FETCH_LINK_PREVIEW, state)
  const uploadAttachmentPending = getUploadAttachmentPending(state)
  const fromPostId = getQuerystringParam('fromPostId', props)
  const editingPostId = getRouteParam('postId', props)
  const attachmentPostId = (editingPostId || fromPostId)
  const uploadFileAttachmentPending = getUploadAttachmentPending(state, { type: 'post', id: attachmentPostId, attachmentType: 'file' })
  const uploadImageAttachmentPending = getUploadAttachmentPending(state, { type: 'post', id: attachmentPostId, attachmentType: 'image' })
  const postPending = isPendingFor([CREATE_POST, CREATE_PROJECT], state)
  const loading = isPendingFor(FETCH_POST, state) || !!uploadAttachmentPending || postPending
  let post = null
  let editing = false
  if (getRouteParam('action', props) === 'edit') {
    post = props.post || presentPost(getPost(state, props))
    editing = !!post || loading
  } else if (fromPostId) {
    post = props.post || presentPost(getPost(state, props))
    post.title = `Copy of ${post.title.slice(0, MAX_TITLE_LENGTH - 8)}`
  }
  const imageAttachments = getAttachments(state, { type: 'post', id: attachmentPostId, attachmentType: 'image' })
  const fileAttachments = getAttachments(state, { type: 'post', id: attachmentPostId, attachmentType: 'file' })
  const showImages = !isEmpty(imageAttachments) || uploadImageAttachmentPending
  const showFiles = !isEmpty(fileAttachments) || uploadFileAttachmentPending
  const context = getRouteParam('context', props)
  const groupSlug = getRouteParam('groupSlug', props)
  const topic = getTopicForCurrentRoute(state, props)
  const topicName = get('name', topic)
  const announcementSelected = state[MODULE_NAME].announcement
  const location = get('location', props)
  const postType = getQuerystringParam('newPostType', props)
  const isProject = postType === 'project' || get('type', post) === 'project'
  const isEvent = postType === 'event' || get('type', post) === 'event'
  const isProposal = postType === 'proposal' || get('type', post) === 'proposal'

  return {
    announcementSelected,
    context,
    currentGroup,
    currentUser,
    editing,
    editingPostId,
    fetchLinkPreviewPending,
    fileAttachments,
    groupOptions,
    groupSlug,
    imageAttachments,
    isEvent,
    isProject,
    isProposal,
    linkPreview,
    linkPreviewStatus,
    loading,
    location,
    myAdminGroups,
    post,
    postPending,
    postType,
    showFiles,
    showImages,
    topic,
    topicName,
    uploadFileAttachmentPending,
    uploadImageAttachmentPending,
    ensureLocationIdIfCoordinate
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    pollingFetchLinkPreviewRaw: url => pollingFetchLinkPreview(dispatch, url),
    ...bindActionCreators({
      changeQueryString: replace,
      goToUrl: push,
      setAnnouncement,
      removeLinkPreview,
      clearLinkPreview,
      updatePost,
      createPost,
      addAttachment,
      fetchLocation
    }, dispatch)
  }
}

export const mergeProps = (stateProps, dispatchProps, ownProps) => {
  const { fetchLinkPreviewPending } = stateProps
  const { pollingFetchLinkPreviewRaw, goToUrl } = dispatchProps

  const goToPost = createPostAction => {
    const id = get('payload.data.createPost.id', createPostAction)
    // * The single letter params are used in the Stream and elsewhere
    // and translate as follow: `s`(ort), `t`(ab), `q`(uery aliased as `search`)
    // The remaining whitelisted params are for the map view.
    const querystringWhitelist = ['s', 't', 'q', 'search', 'zoom', 'center', 'lat', 'lng']
    const querystringParams = ownProps?.location && getQuerystringParam(querystringWhitelist, ownProps)
    const postPath = postUrl(id, ownProps?.match?.params, querystringParams)

    return goToUrl(postPath)
  }

  const pollingFetchLinkPreview = fetchLinkPreviewPending
    ? () => Promise.resolve()
    : url => pollingFetchLinkPreviewRaw(url)

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    goToPost,
    pollingFetchLinkPreview
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
