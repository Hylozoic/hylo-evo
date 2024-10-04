import { connect } from 'react-redux'
import {
  getRecentActivity,
  fetchRecentActivity
} from './RecentActivity.store'

export function mapStateToProps (state, props) {
  return {
    activityItems: getRecentActivity(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchRecentActivity: () => dispatch(fetchRecentActivity(props.routeParams.personId))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
