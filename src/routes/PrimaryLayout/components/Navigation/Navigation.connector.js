import { reduce } from 'lodash/fp'
import { connect } from 'react-redux'
import getCommunityForCurrentRoute from 'store/selectors/getCommunityForCurrentRoute'
import {
  getTopicSubscriptions
} from './TopicNavigation/TopicNavigation.store'

function mapStateToProps (state, props) {
  const community = getCommunityForCurrentRoute(state, props)
  if (!community) return {homePath: '/all'}

  const newPostTotal = reduce((sub, acc) => acc + sub.newPostCount, 0, getTopicSubscriptions(state, props))
  return {
    slug: community.slug,
    homePath: `/c/${community.slug}`,
    homeBadge: newPostTotal > 0 ? newPostTotal : false
  }
}

export default connect(mapStateToProps)
