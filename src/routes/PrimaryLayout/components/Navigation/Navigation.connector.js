import { connect } from 'react-redux'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import getNetworkForCurrentRoute from 'store/selectors/getNetworkForCurrentRoute'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { communityUrl, networkUrl } from 'util/index'
import orm from 'store/models'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const network = getNetworkForCurrentRoute(state, props)
  let rootSlug, rootPath, membersPath, communityMembership, badge
  if (community) {
    rootSlug = get('slug', community)
    rootPath = communityUrl(rootSlug)
    membersPath = `${rootPath}/members`
    // we have to select the Community Membership from the ORM separately. we can't just
    // call `community.Memberships.first()` because that will be cached so long as
    // the community doesn't change, which will mask changes to the Community Membership's
    // newPostCount.
    communityMembership = getCommunityMembership(state, {communityId: community.id})
    badge = get('newPostCount', communityMembership)
  } else if (network) {
    rootSlug = get('slug', network)
    rootPath = networkUrl(rootSlug)
    membersPath = `${rootPath}/members`
  } else {
    rootSlug = ''
    rootPath = communityUrl()
  }
  return {
    rootSlug,
    rootPath,
    membersPath,
    badge,
    communityMembership
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const {
    rootSlug,
    rootPath,
    membersPath,
    badge,
    communityMembership
  } = stateProps
  return {
    ...ownProps,
    rootSlug,
    rootPath,
    membersPath,
    badge,
    clearBadge: badge
      ? () => dispatchProps.resetNewPostCount(communityMembership.community.id, 'Membership')
      : () => {}
  }
}

export default connect(mapStateToProps, {resetNewPostCount}, mergeProps)

const getCommunityMembership = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { communityId }) => communityId,
  (session, id) => session.Membership.safeGet({community: id})
)
