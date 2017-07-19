import { connect } from 'react-redux'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import resetNewPostCount from 'store/actions/resetNewPostCount'
import { createSelector as ormCreateSelector } from 'redux-orm'
import { allCommunitiesUrl } from 'util/index'
import orm from 'store/models'
import { get } from 'lodash/fp'
import { FETCH_POSTS } from 'store/constants'
import { makeDropQueryResults } from 'store/reducers/queryResults'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  if (!community) return {homePath: allCommunitiesUrl()}
  const feedListProps = state.FeedList.feedListProps

  // we have to select the membership from the ORM separately. we can't just
  // call `community.memberships.first()` because that will be cached so long as
  // the community doesn't change, which will mask changes to the membership's
  // newPostCount.
  const membership = getMembership(state, {communityId: community.id})
  const homeBadge = get('newPostCount', membership)
  return {
    feedListProps,
    community,
    membership,
    homeBadge,
    clearFeedList: state.FeedList.clearFeedList
  }
}

const dropPostResults = makeDropQueryResults(FETCH_POSTS)

function mapDispatchToProps (dispatch, props) {
  return {
    resetNewPostCount: (id, type) => dispatch(resetNewPostCount(id, type)),
    dropPostResultsMaker: props => () => dispatch(dropPostResults(props))
  }
}

export function mergeProps (stateProps, dispatchProps, ownProps) {
  const { homeBadge, community, membership, feedListProps } = stateProps
  const { dropPostResultsMaker } = dispatchProps
  return {
    ...ownProps,
    community,
    homeBadge,
    clearFeedList: dropPostResultsMaker(feedListProps),
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
