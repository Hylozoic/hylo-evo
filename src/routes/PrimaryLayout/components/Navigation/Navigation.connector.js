import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getGroupForCurrentRoute from 'store/selectors/getGroupForCurrentRoute'
import getMe from 'store/selectors/getMe'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { baseUrl, isPublicPath } from 'util/navigation'
import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { makeDropQueryResults } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  const routeParams = props.match.params

  const group = getGroupForCurrentRoute(state, props)
  const rootPath = baseUrl(routeParams)
  const projectsPath = `${rootPath}/projects`
  const eventsPath = `${rootPath}/events`
  const groupsPath = `${rootPath}/groups`
  const membersPath = !['/all', '/public'].includes(rootPath) ? `${rootPath}/members` : false
  const mapPath = `${rootPath}/map`
  const createPath = `${props.location.pathname}/create/`

  let groupMembership, badge

  // TODO: what about all groups path? as default?

  if (group) {
    // we have to select the Group Membership from the ORM separately. we can't just
    // call `group.Memberships.first()` because that will be cached so long as
    // the group doesn't change, which will mask changes to the Group Membership's
    // newPostCount.
    groupMembership = getGroupMembership(state, { groupId: group.id })
    badge = get('newPostCount', groupMembership)
  }

  return {
    createPath,
    routeParams,
    groupId: get('id', group),
    hideTopics: isPublicPath(props.location.pathname),
    rootPath,
    membersPath,
    projectsPath,
    eventsPath,
    groupsPath,
    mapPath,
    badge,
    feedListFetchPostsParam: get('FeedList.fetchPostsParam', state),
    groupMembership
  }
}

const dropPostResults = makeDropQueryResults(FETCH_POSTS)

export function mapDispatchToProps (dispatch, props) {
  return {
    resetNewPostCount: (id, type) => dispatch(resetNewPostCount(id, type)),
    dropPostResultsMaker: feedListFetchPostsParam => () => dispatch(dropPostResults(feedListFetchPostsParam))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    badge,
    feedListFetchPostsParam,
    groupMembership
  } = stateProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    clearFeedList: dispatchProps.dropPostResultsMaker(feedListFetchPostsParam),
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
