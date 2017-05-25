import AllTopics, { SearchBar, CommunityTopicListItem } from './AllTopics'
import { shallow } from 'enzyme'
import React from 'react'

describe('AllTopics', () => {
  it('matches the latest snapshot', () => {
    const ct = [
      {
        id: '1',
        topic: {
          id: '2',
          name: 'petitions'
        },
        postsTotal: 24,
        followersTotal: 52,
        isSubscribed: false
      }
    ]
    const wrapper = shallow(<AllTopics
      communityTopics={ct}
      slug='goteam'
      topicsTotal='10' />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('SearchBar', () => {
  it('matches the latest snapshot', () => {
    const props = {
      search: 'test',
      onChangeSearch: () => {},
      selectedSort: 'followers',
      onChangeSort: () => {}
    }
    const wrapper = shallow(<SearchBar {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('TopicListItem', () => {
  it('matches the latest snapshot', () => {
    const ct = {
      id: '1',
      topic: {
        name: 'petitions'
      },
      postsTotal: 24,
      followersTotal: 52,
      subscribed: false
    }
    const wrapper = shallow(<CommunityTopicListItem item={ct} slug='goteam' />)
    expect(wrapper).toMatchSnapshot()
  })
})
