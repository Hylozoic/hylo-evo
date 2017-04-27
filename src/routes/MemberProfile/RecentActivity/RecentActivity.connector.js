import { connect } from 'react-redux'

import { activitySelector, fetchRecentActivity } from './RecentActivity.store'

export function mapStateToProps (state, props) {
  return {
    activityItems: activitySelector(state, props),
    showDetails: (id, slug) => props.navigate(`/c/${slug}/p/${id}`)
  }
}

export default connect(mapStateToProps, { fetchRecentActivity })
