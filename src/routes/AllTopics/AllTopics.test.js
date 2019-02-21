import AllTopics, { SearchBar, TopicListItem } from './AllTopics'
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
      community={{ id: '1', slug: 'goteam' }}
      routeParams={{ slug: 'goteam'}}
      communityTopics={ct}
      topicsTotal='10'
      fetchCommunityTopics={jest.fn()}
      toggleSubscribe={() => {}} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('caches totalTopics', () => {
    const wrapper = shallow(<AllTopics
      routeParams={{ slug: 'goteam'}}
      community={{ id: '1', slug: 'goteam' }}
      fetchCommunityTopics={() => {}}
      toggleSubscribe={() => {}}
      communityTopics={[]}
      selectedSort='followers'
    />)

    expect(wrapper.state().totalTopicsCached).not.toBeDefined()
    wrapper.setProps({totalTopics: 11})
    expect(wrapper.state().totalTopicsCached).toEqual(11)
    wrapper.setProps({totalTopics: 5})
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
  it('matches the latest snapshot', () => {
    const ct = {
      id: '1',
      topic: {
        name: 'petitions'
      },
      postsTotal: 24,
      followersTotal: 52,
      isSubscribed: false
    }
    const wrapper = shallow(<TopicListItem
      item={ct}
      routeParams={{ slug: 'goteam'}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
