import NotificationsDropdown, { Notification, NotificationHeader, NotificationBody } from './NotificationsDropdown'
import { shallow } from 'enzyme'
import React from 'react'
import { ACTION_NEW_COMMENT, ACTION_TAG } from 'store/models/Notification'

const u1 = {id: 1, name: 'Charles Darwin', avatarUrl: 'foo.png'}
const u2 = {id: 2, name: 'Marie Curie', avatarUrl: 'bar.png'}
const u3 = {id: 3, name: 'Arthur Fonzarelli', avatarUrl: 'baz.png'}

const commentNotification = {
  id: 1,
  actor: u2,
  action: ACTION_NEW_COMMENT,
  meta: {},
  post: {title: 'Our Oceans'},
  comment: {
    text: "I live right next to there and can come help out. I've never done petitioning but I'm sure it's an absolute blast"
  },
  unread: true,
  createdAt: new Date('1995-12-17T03:23:00')
}

const tagNotification = {
  id: 2,
  actor: u3,
  action: ACTION_TAG,
  post: {title: 'I have so many things I need!'},
  meta: {reasons: ['tag: request']},
  unread: true,
  createdAt: new Date('1995-12-17T03:23:00')
}

const notifications = [
  commentNotification,
  tagNotification,
  {...commentNotification, unread: false},
  {...tagNotification, unread: false}
]

describe('NotificationsDropdown', () => {
  it('renders correctly with an empty list', () => {
    const wrapper = shallow(<NotificationsDropdown notifications={[]} currentUser={u1} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a list of threads', () => {
    const wrapper = shallow(<NotificationsDropdown notifications={notifications} currentUser={u1} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('Notification', () => {
  it('renders correctly with a comment notification', () => {
    const wrapper = shallow(<Notification notification={commentNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a tag notification', () => {
    const wrapper = shallow(<Notification notification={tagNotification} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('NotificationHeader', () => {
  it('renders correctly with a comment notification', () => {
    const wrapper = shallow(<NotificationHeader notification={commentNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a tag notification', () => {
    const wrapper = shallow(<NotificationHeader notification={tagNotification} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('NotificationBody', () => {
  it('renders correctly with a comment notification', () => {
    const wrapper = shallow(<NotificationBody notification={commentNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a tag notification', () => {
    const wrapper = shallow(<NotificationBody notification={tagNotification} />)
    expect(wrapper).toMatchSnapshot()
  })
})
