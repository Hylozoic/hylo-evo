import NotificationsDropdown, { Notification, NotificationHeader, NotificationBody } from './NotificationsDropdown'
import { shallow } from 'enzyme'
import React from 'react'
import {
  ACTION_NEW_COMMENT,
  ACTION_TAG,
  ACTION_JOIN_REQUEST,
  ACTION_APPROVED_JOIN_REQUEST,
  ACTION_MENTION,
  ACTION_COMMENT_MENTION
 } from 'store/models/Notification'

const u1 = {id: 1, name: 'Charles Darwin', avatarUrl: 'foo.png'}
const u2 = {id: 2, name: 'Marie Curie', avatarUrl: 'bar.png'}
const u3 = {id: 3, name: 'Arthur Fonzarelli', avatarUrl: 'baz.png'}

const commentNotification = {
  id: 1,
  activity: {
    actor: u2,
    action: ACTION_NEW_COMMENT,
    meta: {},
    post: {title: 'Our Oceans'},
    comment: {
      text: "I live right next to there and can come help out. I've never done petitioning but I'm sure it's an absolute blast"
    },
    unread: true
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

const tagNotification = {
  id: 2,
  activity: {
    actor: u3,
    action: ACTION_TAG,
    post: {title: 'I have so many things I need!'},
    meta: {reasons: ['tag: request']},
    unread: true
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

const joinRequestNotification = {
  id: 3,
  activity: {
    actor: u2,
    action: ACTION_JOIN_REQUEST,
    meta: {},
    community: {name: 'Foomunity'},
    unread: true
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

const approvedJoinRequestNotification = {
  id: 4,
  activity: {
    actor: u2,
    action: ACTION_APPROVED_JOIN_REQUEST,
    meta: {},
    community: {name: 'Foomunity'},
    unread: true
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

const mentionNotification = {
  id: 5,
  activity: {
    actor: u2,
    action: ACTION_MENTION,
    meta: {},
    post: {title: 'Heads up'},
    unread: true
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

const commentMentionNotification = {
  id: 1,
  activity: {
    actor: u2,
    action: ACTION_COMMENT_MENTION,
    meta: {},
    post: {title: 'Our Oceans'},
    comment: {
      text: "I live right next to there and can come help out. I've never done petitioning but I'm sure it's an absolute blast"
    },
    unread: true
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

const notifications = [
  commentNotification,
  tagNotification,
  {...commentNotification, unread: false},
  {...tagNotification, unread: false},
  joinRequestNotification,
  approvedJoinRequestNotification,
  mentionNotification,
  commentMentionNotification
]

describe('NotificationsDropdown', () => {
  it('renders correctly with an empty list', () => {
    const wrapper = shallow(<NotificationsDropdown
      renderToggleChildren={() => <span>click me</span>}
      notifications={[]}
      currentUser={u1} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a list of threads', () => {
    const wrapper = shallow(<NotificationsDropdown
      renderToggleChildren={() => <span>click me</span>}
      notifications={notifications}
      currentUser={u1} />)
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

  it('renders correctly with a join request notification', () => {
    const wrapper = shallow(<Notification notification={joinRequestNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with an approved join request notification', () => {
    const wrapper = shallow(<Notification notification={approvedJoinRequestNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a mention notification', () => {
    const wrapper = shallow(<Notification notification={mentionNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a comment mention notification', () => {
    const wrapper = shallow(<Notification notification={commentMentionNotification} />)
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

  it('renders correctly with a join request notification', () => {
    const wrapper = shallow(<NotificationHeader notification={joinRequestNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with an approved join request notification', () => {
    const wrapper = shallow(<NotificationHeader notification={approvedJoinRequestNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a mention notification', () => {
    const wrapper = shallow(<NotificationHeader notification={mentionNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a comment mention notification', () => {
    const wrapper = shallow(<NotificationHeader notification={commentMentionNotification} />)
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
  it('renders correctly with a join request notification', () => {
    const wrapper = shallow(<NotificationBody notification={joinRequestNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with an approved join request notification', () => {
    const wrapper = shallow(<NotificationBody notification={approvedJoinRequestNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a mention notification', () => {
    const wrapper = shallow(<NotificationBody notification={mentionNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a comment mention notification', () => {
    const wrapper = shallow(<NotificationBody notification={commentMentionNotification} />)
    expect(wrapper).toMatchSnapshot()
  })
})
