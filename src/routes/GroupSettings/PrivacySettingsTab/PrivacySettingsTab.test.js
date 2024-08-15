import PrivacySettingsTab from './PrivacySettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('PrivacySettingsTab', () => {
  it('renders correctly', () => {
    const group = {
      id: 1,
      name: 'Foomunity',
      slug: 'foo',
      locationObject: 'Fuji',
      description: 'Great group',
      avatarUrl: 'avatar.png',
      bannerUrl: 'avatar.png',
      accessibility: 1,
      visibility: 1
    }
    const wrapper = shallow(<PrivacySettingsTab group={group} />)
    expect(wrapper).toMatchSnapshot()
  })
})
