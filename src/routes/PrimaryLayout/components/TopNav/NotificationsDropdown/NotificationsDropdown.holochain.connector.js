import { connect } from 'react-redux'
import { push } from 'connected-react-router'
import getMe from 'store/selectors/getMe'
import { urlForNotification } from 'store/models/Notification'

// * Not used by Holochain
export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props),
    notifications: [],
    fetchNotifications: () => {},
    markActivityRead: () => {},
    markAllActivitiesRead: () => {}
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNotification: notification => dispatch(push(urlForNotification(notification)))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)
