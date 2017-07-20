import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { pick, sortBy } from 'lodash/fp'

// Flattens membership, leading to a repetition of network data in some cases.
// NOTE: Limits props returned to avoid dumping a potentially large and detailed
// list verbatim, plus all the baggage of the redux-orm model.
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

const getMemberships = ormCreateSelector(
  orm,
  state => state.orm,
  session => sortBy('community.name', session.Membership
    .all()
    .toModelArray()
    .map(refineData))
)

export default getMemberships
