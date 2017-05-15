import { connect } from 'react-redux'
import { fetchNotifications, getNotifications } from './NotificationsDropdown.store.js'

export function mapStateToProps (state, props) {
  const notifications = getNotifications(state, props)
  return {
    notifications
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchNotifications: () => dispatch(fetchNotifications()),
    goToNotification: notification => () => console.log('going to notification', notification),
    markAsRead: () => console.log('mark as read')
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
