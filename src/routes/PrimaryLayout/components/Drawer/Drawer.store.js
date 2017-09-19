import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { pick } from 'lodash/fp'

// Flattens membership, leading to a repetition of network data in some cases.
function refineData ({ id, community, newPostCount, lastViewedAt }) {
  const { network } = community
  return {
    id,
    newPostCount,
    lastViewedAt,
    community: pick([ 'id', 'name', 'slug', 'avatarUrl' ], community.ref),
    network: network ? pick([ 'id', 'name', 'slug', 'avatarUrl' ], network.ref) : null
  }
}

const getMembershipsForDrawer = ormCreateSelector(
  orm,
  state => state.orm,
  ({ Membership }) =>
      Membership.all().orderBy(m => m.community.name).toModelArray().map(refineData)
)

export default getMembershipsForDrawer
