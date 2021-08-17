import React from 'react'
import { shallow } from 'enzyme'
import Membership from './Membership'

describe('Membership', () => {
  it('matches last snapshot', () => {
    const props = {
      membership: {
        id: '1',
        lastViewedAt: '2020-12-11T01:21:22.424Z',
        newPostCount: null,
        hasModeratorRole: true,
        settings: {
          'sendEmail': null,
          sendPushNotifications: null
        },
        group: {
          id: '53',
          name: 'Backyard Birders',
          slug: 'bb',
          memberCount: 11,
          avatarUrl: 'https://d3ngex8q79bk55.cloudfront.net/misc/default_community_avatar.png',
          network: '1'
        },
        role: null,
        person: '1002'
      }
    }

    const wrapper = shallow(<Membership {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
