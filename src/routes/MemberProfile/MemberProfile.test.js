import { shallow } from 'enzyme'
import React from 'react'

import MemberProfile, { ProfileNamePlate } from './MemberProfile'
import payload from './MemberProfile.normalized.test.json'

describe.only('MemberProfile', () => {
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
    const wrapper = shallow(<MemberProfile { ...props } />)
    expect(wrapper.contains(props.error)).toBe(true)
  })

  describe('ProfileNamePlate', () => {
    it('Sets the username correctly', () => {
      const wrapper = shallow(<ProfileNamePlate { ...payload.person } />)
      expect(wrapper.find('h1').text()).toBe(payload.person.name)
    })

    it('Displays an avatar if one is present', () => {

    })

    it('Displays a default avatar if avatarUrl is null', () => {

    })
  })
})
