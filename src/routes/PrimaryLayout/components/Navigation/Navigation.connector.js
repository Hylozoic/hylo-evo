import { connect } from 'react-redux'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'

function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  if (!community) return {homePath: '/all'}

  return {
    slug: community.slug,
    homePath: `/c/${community.slug}`,
    homeBadge: community.memberships.first().newPostCount
  }
}

export default connect(mapStateToProps)
