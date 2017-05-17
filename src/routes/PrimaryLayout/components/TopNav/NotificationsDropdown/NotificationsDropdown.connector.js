import { connect } from 'react-redux'
import {
  fetchNotifications,
  markActivityRead,
  markAllActivitiesRead,
  getNotifications,
  goToNotification } from './NotificationsDropdown.store.js'

export function mapStateToProps (state, props) {
  const notifications = getNotifications(state, props)
  return {
    notifications
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
