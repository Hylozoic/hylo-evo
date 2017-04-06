import { shallow } from 'enzyme'
import React from 'react'

import UserProfile from './UserProfile'
import payload from './UserProfile.test.json'

it('Exists', () => {
  const wrapper = shallow(<UserProfile />)
  expect(wrapper.find('<div>')).toBeTruthy()
})

it('Sets the username correctly', () => {
  const { person } = payload.data
  const wrapper = shallow(<UserProfile id={person.id} person={person} />)
  expect(wrapper.find('h1').text()).toBe(person.name)
})
