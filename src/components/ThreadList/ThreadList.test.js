import ThreadList from './ThreadList'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const wrapper = shallow(<ThreadList threads={[]} />)
  expect(wrapper).toMatchSnapshot()
})
