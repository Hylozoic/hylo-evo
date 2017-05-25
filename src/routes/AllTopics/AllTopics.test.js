import AllTopics, { SearchBar, TopicListItem } from './AllTopics'
import { shallow } from 'enzyme'
import React from 'react'

describe('AllTopics', () => {
  it('matches the latest snapshot', () => {
    const topics = [
      {
        id: '1',
        name: 'petitions',
        postsTotal: 24,
        followersTotal: 52,
        subscribed: false
      }
    ]
    const wrapper = shallow(<AllTopics
      topics={topics}
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
    const topic = {
      id: '1',
      name: 'petitions',
      postsTotal: 24,
      followersTotal: 52,
      subscribed: false
    }
    const wrapper = shallow(<TopicListItem
      topic={topic}
      slug='goteam' />)
    expect(wrapper).toMatchSnapshot()
  })
})
