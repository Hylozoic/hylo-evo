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
import getQueryParamsObjectFromString from 'store/selectors/getQueryParamsObjectFromString'
import { fetchLocation, ensureLocationIdIfCoordinate } from 'components/LocationInput/LocationInput.store'
import {
  CREATE_POST,
  CREATE_PROJECT,
  FETCH_POST
} from 'store/constants'
import createPost from 'store/actions/createPost'
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
  const currentGroup = getGroupForCurrentRoute(state, props)
  const groupOptions = props.groupOptions ||
    (currentUser && currentUser.memberships.toModelArray().map((m) => m.group).sort((a, b) => a.name.localeCompare(b.name)))
  const myModeratedGroups = (currentUser && groupOptions.filter(c => currentUser.canModerate(c)))
  const linkPreview = getLinkPreview(state, props)
  const linkPreviewStatus = get('linkPreviewStatus', state[MODULE_NAME])
  const fetchLinkPreviewPending = isPendingFor(FETCH_LINK_PREVIEW, state)
  const uploadAttachmentPending = getUploadAttachmentPending(state)
  const editingPostId = getRouteParam('postId', state, props)
  const uploadFileAttachmentPending = getUploadAttachmentPending(state, { type: 'post', id: editingPostId, attachmentType: 'file' })
  const uploadImageAttachmentPending = getUploadAttachmentPending(state, { type: 'post', id: editingPostId, attachmentType: 'image' })
  const postPending = isPendingFor([CREATE_POST, CREATE_PROJECT], state)
  const loading = isPendingFor(FETCH_POST, state) || !!uploadAttachmentPending || !!fetchLinkPreviewPending || postPending
  let post = null
  let editing = false
  if (getRouteParam('action', null, props) === 'edit') {
    post = props.post || presentPost(getPost(state, props))
    editing = !!post || loading
  }
  const imageAttachments = getAttachments(state, { type: 'post', id: editingPostId, attachmentType: 'image' })
  const fileAttachments = getAttachments(state, { type: 'post', id: editingPostId, attachmentType: 'file' })
  const showImages = !isEmpty(imageAttachments) || uploadImageAttachmentPending
  const showFiles = !isEmpty(fileAttachments) || uploadFileAttachmentPending
  const context = getRouteParam('context', null, props)
  const groupSlug = getRouteParam('groupSlug', null, props)
  const topic = getTopicForCurrentRoute(state, props)
  const topicName = get('name', topic)
  const announcementSelected = state[MODULE_NAME].announcement
  const canModerate = currentUser && currentUser.canModerate(currentGroup)
  const defaultTopics = getDefaultTopics(state, { groupSlug, sortBy: 'name' })
  const location = get('location', props)
  const postType = getQuerystringParam('newPostType', null, props)
  const isProject = postType === 'project' || get('type', post) === 'project'
  const isEvent = postType === 'event' || get('type', post) === 'event'
  const querystringParams = getQuerystringParam(['s', 't'], null, props)
  const routeParams = get('match.params', props)

  return {
    context,
    currentUser,
    currentGroup,
    groupOptions,
    defaultTopics,
    postType,
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
    groupSlug,
    announcementSelected,
    canModerate,
    myModeratedGroups,
    uploadFileAttachmentPending,
    uploadImageAttachmentPending,
    location,
    querystringParams,
    routeParams,
    ensureLocationIdIfCoordinate
  }
}

export const mapDispatchToProps = (dispatch) => {
  return {
    pollingFetchLinkPreviewRaw: url => pollingFetchLinkPreview(dispatch, url),
    goToUrl: url => dispatch(push(url)),
    changeQueryString: url => dispatch(replace(url)),
    ...bindActionCreators({
      fetchDefaultTopics,
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
  const {
    fetchLinkPreviewPending, groupSlug, postType, routeParams, querystringParams
  } = stateProps
  const { pollingFetchLinkPreviewRaw, goToUrl } = dispatchProps
  const goToPost = createPostAction => {
    const id = get('payload.data.createPost.id', createPostAction) ||
      get('payload.data.createProject.id', createPostAction)
    const currentParams = getQueryParamsObjectFromString(stateProps.location.search)
    const locationParams = { zoom: currentParams?.zoom, center: currentParams?.center }
    const url = postUrl(id, { ...routeParams, postType }, { ...locationParams, querystringParams })

    return goToUrl(url)
  }
  const pollingFetchLinkPreview = fetchLinkPreviewPending
    ? () => Promise.resolve()
    : url => pollingFetchLinkPreviewRaw(url)
  const fetchDefaultTopics = () => dispatchProps.fetchDefaultTopics({ groupSlug })

  return {
    ...stateProps,
    ...dispatchProps,
    ...ownProps,
    fetchDefaultTopics,
    goToPost,
    pollingFetchLinkPreview
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
