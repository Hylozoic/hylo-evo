import { mount, shallow } from 'enzyme'
import React from 'react'

import SimpleTabBar from './SimpleTabBar'

const tabNames = ['Wombats', 'Aardvarks', 'Ocelots']

it('renders the same as the last snapshot', () => {
  const wrapper = shallow(
    <SimpleTabBar currentTab='Wombats' tabNames={tabNames} />
  )
  expect(wrapper).toMatchSnapshot()
})

it('renders the correct number of tabs', () => {
  const wrapper = shallow(
    <SimpleTabBar tabNames={tabNames} />
  )
  expect(wrapper.find('li').length).toBe(3)
})

it('calls selectTab with the correct value when tab is clicked', () => {
  const selectTab = jest.fn()
  const wrapper = mount(
    <SimpleTabBar tabNames={tabNames} selectTab={selectTab} />
  )
  wrapper.find('li').last().simulate('click')
  const expected = tabNames[2]
  const actual = selectTab.mock.calls[0][0]
  expect(actual).toBe(expected)
})
