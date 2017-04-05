import { shallow } from 'enzyme'
import React from 'react'

import UserProfile from './UserProfile'
import payload from './UserProfile.test.json'

it('Exists', () => {
  const wrapper = shallow(<UserProfile />)
  expect(wrapper.find('<div>')).toBeTruthy()
})
