import CommunitySettingsTab from './CommunitySettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('CommunitySettingsTab', () => {
  it('renders correctly', () => {
    const community = {
      id: 1,
      name: 'Foomunity',
      slug: 'foo',
      location: 'Fuji',
      description: 'Great community',
      avatarUrl: 'avatar.png',
      bannerUrl: 'avatar.png'
    }
    const wrapper = shallow(<CommunitySettingsTab community={community} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('Button').prop('color')).toEqual('gray')
    wrapper.setState({ changed: true })
    expect(wrapper.find('Button').prop('color')).toEqual('green')
  })
})
