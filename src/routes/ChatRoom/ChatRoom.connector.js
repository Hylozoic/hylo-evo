import { push } from 'connected-react-router'
import { get, includes, isEmpty } from 'lodash/fp'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { createSelector as ormCreateSelector } from 'redux-orm'
import {
  addAttachment,
  clearAttachments,
  getAttachments
} from 'components/AttachmentManager/AttachmentManager.store'
import {
  MODULE_NAME,
  FETCH_LINK_PREVIEW,
  pollingFetchLinkPreview,
  removeLinkPreview,
  clearLinkPreview,
  getLinkPreview
} from 'components/PostEditor/PostEditor.store'
import { updateUserSettings } from 'routes/UserSettings/UserSettings.store'
import changeQuerystringParam from 'store/actions/changeQuerystringParam'
import createPost from 'store/actions/createPost'
import fetchGroupTopic from 'store/actions/fetchGroupTopic'
import fetchPosts from 'store/actions/fetchPosts'
import fetchTopic from 'store/actions/fetchTopic'
import respondToEvent from 'store/actions/respondToEvent'
import toggleGroupTopicSubscribe from 'store/actions/toggleGroupTopicSubscribe'
import updateGroupTopicLastReadPost from 'store/actions/updateGroupTopicLastReadPost'
import updatePost from 'store/actions/updatePost'
import { FETCH_POSTS, FETCH_TOPIC, FETCH_GROUP_TOPIC } from 'store/constants'
import orm from 'store/models'
import presentPost from 'store/presenters/presentPost'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getGroupTopicForCurrentRoute from 'store/selectors/getGroupTopicForCurrentRoute'
import getMe from 'store/selectors/getMe'
import getMyMemberships from 'store/selectors/getMyMemberships'
import getQuerystringParam from 'store/selectors/getQuerystringParam'
import { getHasMorePosts, getPostResults, getTotalPosts } from 'store/selectors/getPosts'
import getRouteParam from 'store/selectors/getRouteParam'
import getTopicForCurrentRoute from 'store/selectors/getTopicForCurrentRoute'
import isPendingFor from 'store/selectors/isPendingFor'
import { postUrl } from 'util/navigation'

// selectors
export const getPosts = ormCreateSelector(
  orm,
  getPostResults,
  (session, results) => {
    if (isEmpty(results)) return null
    if (isEmpty(results.ids)) return []
    return session.Post.all()
      .filter(x => includes(x.id, results.ids))
      .orderBy(p => Number(p.id))
      .toModelArray()
      .map(p => presentPost(p))
  }
)

const NUM_POSTS_TO_LOAD = 25

export function mapStateToProps (state, props) {
  let canModerate, group, topic, groupTopic

  const currentUser = getMe(state, props)

  const groupSlug = getRouteParam('groupSlug', state, props)
  if (groupSlug) {
    group = getGroupForCurrentRoute(state, props)
    groupTopic = getGroupTopicForCurrentRoute(state, props)
    groupTopic = groupTopic && { ...groupTopic.ref, group: groupTopic.group, topic: groupTopic.topic }
    canModerate = currentUser && currentUser.canModerate(group)
  }

  const routeParams = get('match.params', props)
  const topicName = getRouteParam('topicName', state, props)
  const topicLoading = isPendingFor([FETCH_TOPIC, FETCH_GROUP_TOPIC], state)

  if (topicName) {
    topic = getTopicForCurrentRoute(state, props)
  }

  if (!topic) {
    // TODO: what? redirect somewhere?
  }

  const context = getRouteParam('context', state, props)
  const view = getRouteParam('view', state, props)

  const currentUserHasMemberships = !isEmpty(getMyMemberships(state))

  const querystringParams = getQuerystringParam(['search'], null, props)
  const search = getQuerystringParam('search', state, props)

  const imageAttachments = getAttachments(state, { type: 'post', id: 'new', attachmentType: 'image' })
  const linkPreview = getLinkPreview(state, props)
  const linkPreviewStatus = get('linkPreviewStatus', state[MODULE_NAME])
  const fetchLinkPreviewPending = isPendingFor(FETCH_LINK_PREVIEW, state)

  // if lastPostRead is null or = last post in this topic then load most recent X # of posts
  // If lastPostRead is set and not last one then load next X posts and last X posts - for same total # of posts? but no not if there are lots more posts to come, then load more to come plus a smaller amount Y of past posts
  // If we know posts are not Chat posts then we load less of them because they take up more space

  const fetchPostsPastParams = {
    context,
    cursor: parseInt(groupTopic?.lastReadPostId) + 1, // -1 because we want the lastread post id included
    filter: 'chat',
    first: NUM_POSTS_TO_LOAD,
    order: 'desc',
    slug: groupSlug,
    search,
    sortBy: 'id',
    topic: topic?.id
  }

  const fetchPostsFutureParams = {
    context,
    cursor: groupTopic?.lastReadPostId,
    filter: 'chat',
    first: NUM_POSTS_TO_LOAD,
    order: 'asc',
    slug: groupSlug,
    search,
    sortBy: 'id',
    topic: topic?.id
  }

  const postsPast = groupTopic?.lastReadPostId ? getPosts(state, fetchPostsPastParams) : []
  const hasMorePostsPast = getHasMorePosts(state, fetchPostsPastParams)
  const totalPastPosts = getTotalPosts(state, fetchPostsPastParams) || 0
  const currentPostIndex = totalPastPosts ? Math.min(Math.max(totalPastPosts - 2, 0), NUM_POSTS_TO_LOAD - 1) : 0

  const postsFuture = getPosts(state, fetchPostsFutureParams)
  const hasMorePostsFuture = getHasMorePosts(state, fetchPostsFutureParams)
  const totalFuturePosts = getTotalPosts(state, fetchPostsFutureParams) || 0

  return {
    canModerate,
    context,
    currentPostIndex,
    currentUser,
    currentUserHasMemberships,
    fetchLinkPreviewPending,
    fetchPostsFutureParams,
    fetchPostsPastParams,
    group,
    groupTopic,
    hasMorePostsFuture,
    hasMorePostsPast,
    imageAttachments,
    linkPreview,
    linkPreviewStatus,
    pending: state.pending[FETCH_POSTS],
    postsFuture,
    postsPast,
    querystringParams,
    postsTotal: totalPastPosts + totalFuturePosts,
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
    fetchPosts: params => offset => {
      return dispatch(fetchPosts({ offset, ...params }))
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
      updateGroupTopicLastReadPost,
      updatePost,
      updateUserSettings: updateSettings // TODO: do we use this?
    }, dispatch)
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { fetchLinkPreviewPending, fetchPostsFutureParams, fetchPostsPastParams } = stateProps
  const { pollingFetchLinkPreviewRaw } = dispatchProps

  const pollingFetchLinkPreview = fetchLinkPreviewPending
    ? () => Promise.resolve()
    : url => pollingFetchLinkPreviewRaw(url)

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    fetchPostsFuture: dispatchProps.fetchPosts(fetchPostsFutureParams),
    fetchPostsPast: dispatchProps.fetchPosts(fetchPostsPastParams),
    pollingFetchLinkPreview
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)
