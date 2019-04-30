import { connect } from 'react-redux'
import { graphql, compose } from 'react-apollo'
import { push } from 'connected-react-router'
import NotificationsQuery from 'graphql/queries/NotificationsQuery.graphql'
import MarkActivityReadMutation from 'graphql/mutations/MarkActivityReadMutation.graphql'
import MarkAllActivitiesReadMutation from 'graphql/mutations/MarkAllActivitiesReadMutation.graphql'
import getMe from 'store/selectors/getMe'
import { urlForNotification } from 'store/models/Notification'

export const fetchNotifications = graphql(NotificationsQuery, {
  props: ({ data: { notifications, loading } }) => ({
    notifications: notifications && notifications.items,
    pending: loading
  })
})

export const markActivityRead = graphql(MarkActivityReadMutation, {
  props: ({ mutate }) => ({
    markActivityRead: id => mutate({ variables: { id } })
  })
})

export const markAllActivitiesRead = graphql(MarkAllActivitiesReadMutation, {
  name: 'markAllActivitiesRead'
})

export function mapStateToProps (state, props) {
  return {
    currentUser: getMe(state, props)
  }
}

export function mapDispatchToProps (dispatch, props) {
  return {
    goToNotification: notification => dispatch(push(urlForNotification(notification)))
  }
}

export default compose(
  fetchNotifications,
  markActivityRead,
  markAllActivitiesRead,
  connect(mapStateToProps, mapDispatchToProps)
)
