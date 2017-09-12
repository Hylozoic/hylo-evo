import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { pick, sortBy } from 'lodash/fp'

// Flattens membership, leading to a repetition of network data in some cases.
function refineData ({ id, community, newPostCount, lastViewedAt }) {
  const { network } = community
  return {
    id,
    newPostCount,
    lastViewedAt,
    community: pick([ 'id', 'name', 'slug', 'avatarUrl' ], community.ref),
    network: network ? pick([ 'id', 'name', 'avatarUrl' ], network.ref) : null
  }
}

const getMembershipsForDrawer = ormCreateSelector(
  orm,
  state => state.orm,
  ({ Me }) =>
    sortBy('community.name',
      Me.first().memberships.toModelArray().map(refineData))
)

export default getMembershipsForDrawer
