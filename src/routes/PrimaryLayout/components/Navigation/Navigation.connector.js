import { connect } from 'react-redux'
import { get } from 'lodash/fp'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { communityUrl, networkUrl, publicCommunitiesUrl } from 'util/navigation'
import orm from 'store/models'
import { FETCH_POSTS } from 'store/constants'
import { makeDropQueryResults } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  const routeParams = props.match.params
  const community = getCommunityForCurrentRoute(state, props)
  const network = getNetworkForCurrentRoute(state, props)
  let rootId, rootSlug, rootPath, membersPath, communityMembership, badge
  const isPublic = props.location.pathname.includes('public')

  // TODO: what about all communities path? as default?

  if (community) {
    // we have to select the Community Membership from the ORM separately. we can't just
    // call `community.Memberships.first()` because that will be cached so long as
    // the community doesn't change, which will mask changes to the Community Membership's
    // newPostCount.
    communityMembership = getCommunityMembership(state, { communityId: community.id })
    badge = get('newPostCount', communityMembership)
  } else if (network) {
    rootId = network.id
    rootSlug = get('slug', network)
    rootPath = networkUrl(rootSlug)
    membersPath = `${rootPath}/members`
  } else if (isPublic) {
    rootSlug = 'public'
    rootPath = publicCommunitiesUrl()
  } else {
    rootSlug = ''
    rootPath = communityUrl()
  }
  const projectsPath = `${rootPath}/project`
  const eventsPath = `${rootPath}/event`
  const mapPath = `${rootPath}/map`

  return {
    routeParams,
    communityId: get('id', community),
    rootPath,
    membersPath,
    projectsPath,
    eventsPath,
    mapPath,
    badge,
    feedListFetchPostsParam: get('FeedList.fetchPostsParam', state),
    communityMembership
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
    communityMembership
  } = stateProps

  return {
    ...ownProps,
    ...stateProps,
    ...dispatchProps,
    clearFeedList: dispatchProps.dropPostResultsMaker(feedListFetchPostsParam),
    clearBadge: badge
      ? () => dispatchProps.resetNewPostCount(communityMembership.community.id, 'Membership')
      : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)

const getCommunityMembership = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { communityId }) => communityId,
  (session, id) => session.Membership.safeGet({ community: id })
)
