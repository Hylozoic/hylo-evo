import { connect } from 'react-redux'

import { activitySelector, fetchRecentActivity } from './RecentActivity.store'

export function mapStateToProps (state, props) {
  return {
    activityItems: activitySelector(state, props)
  }
}

export function mapDispatchToProps (dispatch, { navigate }) {
  return {
    fetchRecentActivity: id => dispatch(fetchRecentActivity(id)),
    showDetails: (id, slug) => navigate(`/c/${slug}/p/${id}`)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
