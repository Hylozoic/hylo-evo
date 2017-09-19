import { connect } from 'react-redux'
import getParam from 'store/selectors/getParam'
import getMe from 'store/selectors/getMe'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import { createSelector as ormCreateSelector } from 'redux-orm'
import orm from 'store/models'
import { find, get } from 'lodash/fp'

const getCanModerate = ormCreateSelector(
  orm,
  state => state.orm,
  (state, props) => props.community,
  ({ Membership }, community) => {
    const memberships = Membership.all().toRefArray()
    const membership = find(m =>
      m.community === get('id', community), memberships)
    return get('hasModeratorRole', membership)
  }
)

export function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  const members = community ? community.members.toModelArray().slice(0, 8) : []
  const leaders = community ? community.moderators.toModelArray() : []
  const currentUser = getMe(state, props)

  const canModerate = getCanModerate(state, {community})

  return {
    community: community ? community.ref : null,
    members,
    leaders,
    slug: getParam('slug', state, props),
    currentUser,
    canModerate
  }
}

export default connect(mapStateToProps)
