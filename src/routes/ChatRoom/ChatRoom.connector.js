import { push } from 'connected-react-router'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { get, isEmpty } from 'lodash/fp'
import {
  addAttachment,
  clearAttachments,
  getAttachments,
  getUploadAttachmentPending
} from 'components/AttachmentManager/AttachmentManager.store'
import { FETCH_POSTS, FETCH_TOPIC, FETCH_GROUP_TOPIC } from 'store/constants'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import {
  fetchGroupTopic,
  fetchPosts,
  fetchTopic,
  getHasMorePosts,
  getPosts
} from 'routes/ChatRoom/ChatRoom.store'
import {
  MODULE_NAME,
  FETCH_LINK_PREVIEW,
  pollingFetchLinkPreview,
  removeLinkPreview,
  clearLinkPreview,
  getLinkPreview
} from 'components/PostEditor/PostEditor.store'
import createPost from 'store/actions/createPost'
import getRouteParam from 'store/selectors/getRouteParam'
import getGroupTopicForCurrentRoute from 'store/selectors/getGroupTopicForCurrentRoute'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import respondToEvent from 'store/actions/respondToEvent'
import isPendingFor from 'store/selectors/isPendingFor'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'
import { createPostUrl, postUrl } from 'util/navigation'

export function mapStateToProps (state, props) {
  let group, topic, groupTopic
  let groupId = 0

  const groupSlug = getRouteParam('groupSlug', state, props)

  if (groupSlug) {
    group = getGroupForCurrentRoute(state, props)
    groupId = group.id
  }

  const routeParams = get('match.params', props)
  const topicName = getRouteParam('topicName', state, props)
  const topicLoading = isPendingFor([FETCH_TOPIC, FETCH_GROUP_TOPIC], state)

  if (groupSlug) {
    groupTopic = getGroupTopicForCurrentRoute(state, props)
    groupTopic = groupTopic && { ...groupTopic.ref, group: groupTopic.group, topic: groupTopic.topic }
  }
  if (topicName) {
    topic = getTopicForCurrentRoute(state, props)
  }

  const context = getRouteParam('context', state, props)
  const view = getRouteParam('view', state, props)

  const currentUser = getMe(state, props)
  const currentUserHasMemberships = !isEmpty(getMyMemberships(state))

  const querystringParams = getQuerystringParam(['search'], null, props)
  const search = getQuerystringParam('search', state, props)

  const imageAttachments = getAttachments(state, { type: 'post', id: 'new', attachmentType: 'image' })
  console.log("image attachments", imageAttachments)
  const linkPreview = getLinkPreview(state, props)
  const linkPreviewStatus = get('linkPreviewStatus', state[MODULE_NAME])
  const fetchLinkPreviewPending = isPendingFor(FETCH_LINK_PREVIEW, state)

  const fetchPostsParam = {
    context,
    slug: groupSlug,
    search,
    sortBy: 'created',
    topic: topic?.id,
    topicName
  }

  const posts = getPosts(state, fetchPostsParam)
  const hasMore = getHasMorePosts(state, fetchPostsParam)

  return {
    context,
    currentUser,
    currentUserHasMemberships,
    fetchLinkPreviewPending,
    fetchPostsParam,
    group,
    groupTopic,
    hasMore,
    imageAttachments,
    linkPreview,
    linkPreviewStatus,
    pending: state.pending[FETCH_POSTS],
    posts,
    querystringParams,
    postsTotal: get('postsTotal', groupSlug ? groupTopic : topic),
    followersTotal: get('followersTotal', groupSlug ? groupTopic : topic),
    routeParams,
    search,
    selectedPostId: getRouteParam('postId', state, props),
    topicLoading,
    topicName,
    topic,
    view
  }
}

export function mapDispatchToProps (dispatch, props) {
  const groupSlug = getRouteParam('groupSlug', null, props)
  const topicName = getRouteParam('topicName', null, props)
  const updateSettings = (params) => dispatch(updateUserSettings(params))
  const routeParams = get('match.params', props)
  const querystringParams = getQuerystringParam(['s', 't'], null, props)

  return {
    changeSearch: search => {
      return dispatch(changeQuerystringParam(props, 'search', search, 'all'))
    },
    clearImageAttachments: () => dispatch(clearAttachments('post', 'new', 'image')),
    fetchPosts: param => offset => {
      return dispatch(fetchPosts({ offset, ...param }))
    },
    fetchTopic: () => {
      if (groupSlug && topicName) {
        return dispatch(fetchGroupTopic(topicName, groupSlug))
      } else if (topicName) {
        return dispatch(fetchTopic(topicName))
      }
    },
    pollingFetchLinkPreviewRaw: url => pollingFetchLinkPreview(dispatch, url),
    respondToEvent: (postId) => response => dispatch(respondToEvent(postId, response)),
    showDetails: (postId) => dispatch(push(postUrl(postId, routeParams, { ...props.locationParams, ...querystringParams }))),
    toggleGroupTopicSubscribe: groupTopic => dispatch(toggleGroupTopicSubscribe(groupTopic)),
    ...bindActionCreators({
      addAttachment,
      clearLinkPreview,
      createPost,
      removeLinkPreview,
      updateUserSettings: updateSettings // TODO: do we use this?
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchLinkPreviewPending, fetchPostsParam } = stateProps
  const { pollingFetchLinkPreviewRaw } = dispatchProps

  const pollingFetchLinkPreview = fetchLinkPreviewPending
    ? () => Promise.resolve()
    : url => pollingFetchLinkPreviewRaw(url)

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchPosts: dispatchProps.fetchPosts(fetchPostsParam),
    pollingFetchLinkPreview
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
