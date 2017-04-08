import { shallow } from 'enzyme'
import React from 'react'

import PersonProfile from './PersonProfile'
import payload from './PersonProfile.normalized.test.json'

describe('PersonProfile', () => {
  const defaultPerson = {
    name: '',
    avatarUrl: '',
    bannerUrl: '',
    posts: []
  }

  it('Sets the username correctly', () => {
    const person = { ...payload.person, posts: [] }
    const wrapper = shallow(<PersonProfile id={person.id} person={person} />)
    expect(wrapper.find('h1').text()).toBe(person.name)
  })

  it.only('Displays an error if one is present', () => {
    const props = {
      error: 'WOMBAT-TYPE INVALID',
      person: defaultPerson
    }
    const wrapper = shallow(<PersonProfile { ...props } />)
    expect(wrapper.contains('foo')).toBe(true)
  })
})
