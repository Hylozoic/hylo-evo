import NotificationsDropdown, { Notification, NotificationHeader, NotificationBody } from './NotificationsDropdown'
import { shallow } from 'enzyme'
import React from 'react'
import {
  ACTION_NEW_COMMENT,
  ACTION_TAG,
  ACTION_JOIN_REQUEST,
  ACTION_APPROVED_JOIN_REQUEST,
  ACTION_MENTION,
  ACTION_COMMENT_MENTION,
  ACTION_ANNOUNCEMENT,
  ACTION_DONATION_TO,
  ACTION_DONATION_FROM
  // ACTION_EVENT_INVITATION
} from 'store/models/Notification'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  },
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

const u1 = { id: 1, name: 'Charles Darwin', avatarUrl: 'foo.png' }
const u2 = { id: 2, name: 'Marie Curie', avatarUrl: 'bar.png' }
const u3 = { id: 3, name: 'Arthur Fonzarelli', avatarUrl: 'baz.png' }

const commentNotification = {
  id: 1,
  activity: {
    actor: u2,
    action: ACTION_NEW_COMMENT,
    meta: {},
    post: { title: 'Our Oceans' },
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
    post: { title: 'I have so many things I need!' },
    meta: { reasons: ['tag: request'] },
    group: { name: 'Foomunity' },
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
    group: { name: 'Foomunity' },
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
    group: { name: 'Foomunity' },
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
    post: { title: 'Heads up' },
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
    post: { title: 'Our Oceans' },
    comment: {
      text: "I live right next to there and can come help out. I've never done petitioning but I'm sure it's an absolute blast"
    },
    unread: true
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

const donationToNotification = {
  id: 1,
  activity: {
    actor: u2,
    action: ACTION_DONATION_TO,
    meta: {},
    post: { title: 'Our Oceans' },
    unread: true,
    contributionAmount: 12300
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

const donationFromNotification = {
  id: 1,
  activity: {
    actor: u2,
    action: ACTION_DONATION_FROM,
    meta: {},
    post: { title: 'Our Oceans' },
    unread: true,
    contributionAmount: 12300
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

const notifications = [
  commentNotification,
  tagNotification,
  { ...commentNotification, unread: false },
  { ...tagNotification, unread: false },
  joinRequestNotification,
  approvedJoinRequestNotification,
  mentionNotification,
  commentMentionNotification
]

const announcementNotification = {
  id: 10,
  activity: {
    actor: u2,
    action: ACTION_ANNOUNCEMENT,
    meta: {},
    post: { title: 'Announcement' },
    unread: true
  },
  createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
}

// const eventInvitationNotification = {
//   id: 10,
//   activity: {
//     actor: u2,
//     action: ACTION_EVENT_INVITATION,
//     meta: {},
//     post: { title: 'Event' },
//     unread: true
//   },
//   createdAt: new Date(Date.UTC(1995, 11, 17, 3, 23, 0))
// }

describe('NotificationsDropdown', () => {
  it('renders correctly with an empty list', () => {
    const wrapper = shallow(<NotificationsDropdown
      renderToggleChildren={() => <span>click me</span>}
      notifications={[]}
      currentUser={u1}
      fetchNotifications={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a list of threads', () => {
    const wrapper = shallow(<NotificationsDropdown
      renderToggleChildren={() => <span>click me</span>}
      notifications={notifications}
      currentUser={u1}
      fetchNotifications={jest.fn()}
    />)
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

  it('renders correctly with a donation to notification', () => {
    const wrapper = shallow(<Notification notification={donationToNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a donation to notification', () => {
    const wrapper = shallow(<Notification notification={donationFromNotification} />)
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

  it('renders correctly with a donation to notification', () => {
    const wrapper = shallow(<NotificationHeader notification={donationToNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a donation from notification', () => {
    const wrapper = shallow(<NotificationHeader notification={donationFromNotification} />)
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

  it('renders correctly with an announcement notification', () => {
    const wrapper = shallow(<NotificationBody notification={announcementNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a donation to notification', () => {
    const wrapper = shallow(<NotificationBody notification={donationToNotification} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a donation from notification', () => {
    const wrapper = shallow(<NotificationBody notification={donationFromNotification} />)
    expect(wrapper).toMatchSnapshot()
  })
})
