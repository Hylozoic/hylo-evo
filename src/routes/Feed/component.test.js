import React from 'react'
import { shallow } from 'enzyme'
import Feed from './component'
import TabBar from './TabBar'

it('has a TabBar', () => {
  const wrapper = shallow(<Feed />)
  const tabBar = <TabBar feedId='feed' tabName='all' sortOption='latest' />
  expect(wrapper.contains(tabBar)).toEqual(true)
})
