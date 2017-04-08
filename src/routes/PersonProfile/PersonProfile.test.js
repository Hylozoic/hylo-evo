import { shallow } from 'enzyme'
import React from 'react'

import PersonProfile from './PersonProfile'
import payload from './PersonProfile.normalized.test.json'

it('Sets the username correctly', () => {
  const person = { ...payload.person, posts: [] }
  const wrapper = shallow(<PersonProfile id={person.id} person={person} />)
  expect(wrapper.find('h1').text()).toBe(person.name)
})

