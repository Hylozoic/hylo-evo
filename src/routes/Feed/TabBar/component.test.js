import React from 'react'
import { shallow } from 'enzyme'
import Feed from './component'

it('Has at least one linebreak!', () => {
  const wrapper = shallow(<Feed />)
  expect(wrapper.contains(<br />)).toEqual(true)
})
