import React from 'react'
import TopicNavigation from './TopicNavigation'
import { shallow } from 'enzyme'

describe('TopicNavigation', () => {
  it('renders correctly', () => {
    const communityTopics = [
      {topic: {name: 't1'}, newPostCount: 3},
      {topic: {name: 't2'}, newPostCount: 0},
      {topic: {name: 't3'}},
      {topic: {name: 't4'}, newPostCount: 2}
    ]

    const wrapper = shallow(<TopicNavigation
      communityTopics={communityTopics}
      community={{slug: 'foo'}} />)
    expect(wrapper.find('li').length).toEqual(4)
    expect(wrapper.find('Badge').length).toEqual(2)
    expect(wrapper.find('li Link span').at(0).text()).toEqual(`#${communityTopics[0].topic.name}`)
    expect(wrapper.find('li Link span').at(3).text()).toEqual(`#${communityTopics[3].topic.name}`)
  })
})
