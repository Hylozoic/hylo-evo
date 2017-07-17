import { connect } from 'react-redux'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { allCommunitiesUrl } from 'util/index'
import orm from 'store/models'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  if (!community) return {homePath: allCommunitiesUrl()}

  // we have to select the membership from the ORM separately. we can't just
  // call `community.memberships.first()` because that will be cached so long as
  // the community doesn't change, which will mask changes to the membership's
  // newPostCount.
  const membership = getMembership(state, {communityId: community.id})
  const homeBadge = get('newPostCount', membership)
  return {
    community,
    membership,
    homeBadge,
    clearFeedList: state.FeedList.clearFeedList
  }
}

function mapDispatchToProps (dispatch, props) {
  return {
    resetNewPostCount: (id, type) => dispatch(resetNewPostCount(id, type))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { homeBadge, community, membership, clearFeedList } = stateProps
  return {
    ...ownProps,
    community,
    homeBadge,
    clearFeedList,
    clearBadge: homeBadge
      ? () => dispatchProps.resetNewPostCount(membership.community.id, 'Membership')
      : () => {}
  }
}

export default connect(mapStateToProps, mapDispatchToProps, mergeProps)

const getMembership = ormCreateSelector(
  orm,
  state => state.orm,
  (state, { communityId }) => communityId,
  (session, id) => session.Membership.safeGet({community: id})
)
