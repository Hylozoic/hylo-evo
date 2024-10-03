import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import { getChildGroups, getParentGroups } from 'store/selectors/getGroupRelationships'
import getMe from 'store/selectors/getMe'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { isPublicPath, baseUrl, viewUrl } from 'util/navigation'
import { toggleGroupMenu } from 'routes/AuthLayoutRouter/AuthLayoutRouter.store'
import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { makeDropQueryResults } from 'store/reducers/queryResults'

// XXX: remove this file

export function mapStateToProps (state, props) {
  const routeParams = props.match.params
  const group = getGroupForCurrentRoute(state, props)
  const rootPath = baseUrl({ ...routeParams, view: null })
  const isAllOrPublicPath = ['/all', '/public'].includes(rootPath)
  let badge, groupMembership, hasRelatedGroups

  if (group) {
    // we have to select the Group Membership from the ORM separately. we can't just
    // call `group.Memberships.first()` because that will be cached so long as
    // the group doesn't change, which will mask changes to the Group Membership's
    // newPostCount.
    groupMembership = getGroupMembership(state, { groupId: group.id })
    badge = get('newPostCount', groupMembership)
    const childGroups = getChildGroups(state, group)
    const parentGroups = getParentGroups(state, group)
    hasRelatedGroups = childGroups.length > 0 || parentGroups.length > 0
  }

  return {
    badge,
    createPath: `${props.location.pathname}/create${props.location.search}`,
    eventsPath: viewUrl('events', routeParams),
    explorePath: !isAllOrPublicPath && viewUrl('explore', routeParams),
    streamFetchPostsParam: get('Stream.fetchPostsParam', state),
    groupId: get('id', group),
    groupMembership,
    groupsPath: viewUrl('groups', routeParams),
    streamPath: viewUrl('stream', routeParams),
    hasRelatedGroups,
    hideTopics: isPublicPath(props.location.pathname),
    isGroupMenuOpen: get('AuthLayoutRouter.isGroupMenuOpen', state),
    mapPath: viewUrl('map', routeParams),
    membersPath: !isAllOrPublicPath && viewUrl('members', routeParams),
    projectsPath: viewUrl('projects', routeParams),
    proposalPath: viewUrl('proposals', routeParams),
    rootPath,
    routeParams
  }
}

const dropPostResults = makeDropQueryResults(FETCH_POSTS)

export function mapDispatchToProps (dispatch, props) {
  return {
    resetNewPostCount: (id, type) => dispatch(resetNewPostCount(id, type)),
    dropPostResultsMaker: streamFetchPostsParam => () => dispatch(dropPostResults(streamFetchPostsParam)),
    toggleGroupMenu: () => dispatch(toggleGroupMenu())
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    badge,
    streamFetchPostsParam,
    groupMembership
  } = stateProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    clearStream: dispatchProps.dropPostResultsMaker(streamFetchPostsParam),
    clearBadge: badge
      ? () => dispatchProps.resetNewPostCount(groupMembership.group.id, 'Membership')
      : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)

const getGroupMembership = ormCreateSelector(
  orm,
  getMe,
  (state, { groupId }) => groupId,
  (session, currentUser, id) => session.Membership.filter({ group: id, person: currentUser }).first()
)
