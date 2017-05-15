import { connect } from 'react-redux'
import { fetchNotifications } from './NotificationsDropdown.store.js'
import { getMe } from 'store/selectors/getMe'
import faker from 'faker'
import samplePost, { fakePerson } from 'components/PostCard/samplePost'
import { ACTION_NEW_COMMENT, ACTION_TAG } from 'store/models/Notification'

faker.seed(1235)

const NOTIFICATIONS = [
  {
    id: 1,
    actor: fakePerson(),
    action: ACTION_NEW_COMMENT,
    meta: {},
    post: {...samplePost(), title: 'Our Oceans'},
    comment: {
      text: "I live right next to there and can come help out. I've never done petitioning but I'm sure it's an absolute blast"
    },
    unread: true,
    createdAt: faker.date.recent().toString()
  },
  {
    id: 2,
    actor: fakePerson(),
    action: ACTION_TAG,
    post: {...samplePost(), title: 'Our Oceans'},
    meta: {reasons: ['tag: request']},
    unread: true,
    createdAt: faker.date.recent().toString()
  },
  {
    id: 3,
    actor: fakePerson(),
    action: ACTION_NEW_COMMENT,
    post: {...samplePost(), title: 'Our Oceans'},
    meta: {},
    comment: {
      text: "I live right next to there and can come help out. I've never done petitioning but I'm sure it's an absolute blast"
    },
    unread: false,
    createdAt: faker.date.recent().toString()
  },
  {
    id: 4,
    actor: fakePerson(),
    action: ACTION_TAG,
    post: {...samplePost(), title: 'Our Oceans'},
    meta: {reasons: ['tag: request']},
    unread: false,
    createdAt: faker.date.recent().toString()
  }
]

export function mapStateToProps (state, props) {
  return {
    // currentUser: getMe(state, props), ???
    notifications: NOTIFICATIONS
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
