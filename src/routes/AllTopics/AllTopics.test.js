import React from 'react'
import { shallow } from 'enzyme'
import AllTopics, { SearchBar, TopicListItem } from './AllTopics'

describe('AllTopics', () => {
  it('matches the latest snapshot', () => {
    const topic = [
      {
        id: '1',
        name: 'petitions',
        postsTotal: 24,
        followersTotal: 52,
        isSubscribed: false
      }
    ]
    const wrapper = shallow(<AllTopics
      group={{ id: '1', slug: 'goteam' }}
      routeParams={{ slug: 'goteam' }}
      topics={topic}
      topicsTotal='10'
      fetchTopics={jest.fn()}
      togglegroupTopicSubscribe={() => {}} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('caches totalTopics', () => {
    const wrapper = shallow(<AllTopics
      routeParams={{ slug: 'goteam' }}
      group={{ id: '1', slug: 'goteam' }}
      fetchTopics={() => {}}
      togglegroupTopicSubscribe={() => {}}
      topics={[]}
      selectedSort='followers'
    />)

    expect(wrapper.state().totalTopicsCached).not.toBeDefined()
    wrapper.setProps({ totalTopics: 11 })
    expect(wrapper.state().totalTopicsCached).toEqual(11)
    wrapper.setProps({ totalTopics: 5 })
    expect(wrapper.state().totalTopicsCached).toEqual(11)
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
  it('when multiple groups matches the latest snapshot', () => {
    const topic = {
      name: 'petitions',
      groupTopics: [
        {
          id: '1',
          postsTotal: 24,
          followersTotal: 52,
          isSubscribed: false
        },
        {
          id: '2',
          postsTotal: 1,
          followersTotal: 4,
          isSubscribed: true
        }
      ]
    }
    const wrapper = shallow(<TopicListItem
      topic={topic}
      routeParams={{ slug: 'goteam' }} />)
    expect(wrapper).toMatchSnapshot()
  })
})
