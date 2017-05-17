import { connect } from 'react-redux'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { RESET_NEW_POST_COUNT } from 'store/constants'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { get } from 'lodash/fp'

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  if (!community) return {homePath: '/all'}

  // we have to select the membership from the ORM separately. we can't just
  // call `community.memberships.first()` because that will be cached so long as
  // the community doesn't change, which will mask changes to the membership's
  // newPostCount.
  const membership = getMembership(state, community.id)

  return {
    slug: community.slug,
    homePath: `/c/${community.slug}`,
    homeBadge: get('newPostCount', membership)
  }
}

export default connect(mapStateToProps, {resetNewPostCount})

function resetNewPostCount (slug) {
  return {
    type: RESET_NEW_POST_COUNT,
    graphql: {
      query: `mutation($slug: String, $data: MembershipInput) {
        updateMembership(slug: $slug, data: $data) {
          newPostCount
        }
      }`,
      variables: {
        slug,
        data: {
          newPostCount: 0
        }
      }
    },
    meta: {id: slug, type: 'community', optimistic: true}
  }
}

const getMembership = ormCreateSelector(
  orm,
  state => state.orm,
  (state, communityId) => communityId,
  (session, id) => session.Membership.safeGet({community: id})
)
