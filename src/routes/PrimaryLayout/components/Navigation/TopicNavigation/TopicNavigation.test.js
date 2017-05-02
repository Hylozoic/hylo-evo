import React from 'react'
import TopicNavigation from './TopicNavigation'
import { shallow } from 'enzyme'

describe('TopicNavigation', () => {
  it('renders correctly', () => {
    const topics = [
      {name: 't1', badge: 3},
      {name: 't2', badge: 0},
      {name: 't3'},
      {name: 't4', badge: 2}
    ]

    const wrapper = shallow(<TopicNavigation topics={topics} />)
    expect(wrapper.find('li').length).toEqual(4)
    expect(wrapper.find('Badge').length).toEqual(2)
    expect(wrapper.find('li Link span').at(0).text()).toEqual(`#${topics[0].name}`)
    expect(wrapper.find('li Link span').at(3).text()).toEqual(`#${topics[3].name}`)
  })
})
