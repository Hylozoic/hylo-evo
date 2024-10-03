import { connect } from 'react-redux'
import {
  fetchNotifications,
  markActivityRead,
  markAllActivitiesRead,
  getHasMoreNotifications,
  getNotifications
} from './NotificationsDropdown.store'
import getMe from 'store/selectors/getMe'
import { urlForNotification } from 'store/models/Notification'
import { push } from 'redux-first-history'
import { FETCH_NOTIFICATIONS } from 'store/constants'

const NOTIFICATIONS_PAGE_SIZE = 20

export function mapStateToProps (state, props) {
  const notifications = getNotifications(state, props)
  return {
    notifications,
    hasMore: getHasMoreNotifications(state),
    currentUser: getMe(state, props),
    pending: state.pending[FETCH_NOTIFICATIONS]
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    fetchNotifications: () => dispatch(fetchNotifications()),
    fetchMore: offset => dispatch(fetchNotifications(NOTIFICATIONS_PAGE_SIZE, offset)),
    goToNotification: notification => dispatch(push(urlForNotification(notification))),
    markActivityRead: id => dispatch(markActivityRead(id)),
    markAllActivitiesRead: () => dispatch(markAllActivitiesRead())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
