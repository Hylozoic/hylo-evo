import { shallow } from 'enzyme'
import React from 'react'

import PersonProfile from './PersonProfile'
import payload from './PersonProfile.test.json'

it('Exists', () => {
  const wrapper = shallow(<PersonProfile />)
  expect(wrapper.find('<div>')).toBeTruthy()
})

it('Sets the username correctly', () => {
  const { person } = payload.data
  const wrapper = shallow(<PersonProfile id={person.id} person={person} />)
  expect(wrapper.find('h1').text()).toBe(person.name)
})
