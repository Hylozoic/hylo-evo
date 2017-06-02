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
      topicsTotal='10'
      toggleSubscribe={() => {}} />)

    expect(wrapper).toMatchSnapshot()
  })

  it('caches totalTopics', () => {
    const wrapper = shallow(<AllTopics
      fetchCommunityTopics={() => {}}
      toggleSubscribe={() => {}}
      communityTopics={[]}
      selectedSort='followers'
    />)

    // calling lifecycle methods by hand here because they don't fire
    // on a shallow rendered component
    wrapper.instance().componentDidMount()
    expect(wrapper.state().totalTopicsCached).not.toBeDefined()
    var prevProps = wrapper.props
    wrapper.setProps({totalTopics: 11})
    wrapper.instance().componentDidUpdate(prevProps, wrapper.props())
    expect(wrapper.state().totalTopicsCached).toEqual(11)
    wrapper.setProps({totalTopics: 5})
    wrapper.instance().componentDidUpdate(prevProps, wrapper.props())
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

  it('throws an error when given a bad selectedSort', () => {
    const props = {
      search: 'test',
      onChangeSearch: () => {},
      selectedSort: 'nogood',
      onChangeSort: () => {}
    }
    expect(() => {
      shallow(<SearchBar {...props} />)
    }).toThrow(new Error('nogood is not a valid value for selectedSort'))
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
    const wrapper = shallow(<CommunityTopicListItem item={ct} slug='goteam' />)
    expect(wrapper).toMatchSnapshot()
  })
})
