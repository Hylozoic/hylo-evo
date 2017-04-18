import { connect } from 'react-redux'

import { activitySelector } from './RecentActivity.store'

export function mapStateToProps (state, props) {
  return activitySelector(state, props) || {}
}

export default connect(mapStateToProps)
