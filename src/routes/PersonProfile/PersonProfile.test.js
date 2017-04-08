import { shallow } from 'enzyme'
import React from 'react'

import PersonProfile, { ProfileHeader } from './PersonProfile'
import payload from './PersonProfile.normalized.test.json'

describe.only('PersonProfile', () => {
  const defaultPerson = {
    name: '',
    avatarUrl: '',
    bannerUrl: '',
    posts: []
  }

  it('Displays an error if one is present', () => {
    const props = {
      error: 'WOMBAT-TYPE INVALID',
      person: defaultPerson
    }
    const wrapper = shallow(<PersonProfile { ...props } />)
    expect(wrapper.contains(props.error)).toBe(true)
  })

  describe('ProfileHeader', () => {
    it('Sets the username correctly', () => {
      const wrapper = shallow(<ProfileHeader { ...payload.person } />)
      expect(wrapper.find('h1').text()).toBe(payload.person.name)
    })

    it('Displays an avatar if one is present', () => {

    })

    it('Displays a default avatar if avatarUrl is null', () => {

    })
  })
})
