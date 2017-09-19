import { connect } from 'react-redux'
import {
  fetchNotifications,
  markActivityRead,
  markAllActivitiesRead,
  getNotifications,
  goToNotification
} from './NotificationsDropdown.store'
import getMe from 'store/selectors/getMe'
import { FETCH_NOTIFICATIONS } from 'store/constants'

export function mapStateToProps (state, props) {
  const notifications = getNotifications(state, props)
  return {
    notifications,
    currentUser: getMe(state, props),
    pending: state.pending[FETCH_NOTIFICATIONS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchNotifications: () => dispatch(fetchNotifications()),
    goToNotification: notification => dispatch(goToNotification(notification)),
    markActivityRead: id => dispatch(markActivityRead(id)),
    markAllActivitiesRead: () => dispatch(markAllActivitiesRead())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
