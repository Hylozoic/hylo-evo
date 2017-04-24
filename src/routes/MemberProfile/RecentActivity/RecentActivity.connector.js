import { connect } from 'react-redux'

import { activitySelector, fetchRecentActivity } from './RecentActivity.store'

export function mapStateToProps (state, props) {
  return {
    activityItems: activitySelector(state, props)
  }
}

export default connect(mapStateToProps, { fetchRecentActivity })
