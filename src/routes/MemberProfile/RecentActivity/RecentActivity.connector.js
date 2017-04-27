import { connect } from 'react-redux'
import { push } from 'react-router-redux'

import { activitySelector, fetchRecentActivity } from './RecentActivity.store'

export function mapStateToProps (state, props) {
  return {
    activityItems: activitySelector(state, props)
  }
}

export const mapDispatchToProps = {
  fetchRecentActivity,
  showDetails: (id, slug) => push(`/c/${slug}/p/${id}`)
}

export default connect(mapStateToProps, mapDispatchToProps)
