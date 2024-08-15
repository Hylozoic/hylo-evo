import GroupSettingsTab from './GroupSettingsTab'
import { shallow } from 'enzyme'
import React from 'react'

describe('GroupSettingsTab', () => {
  it('renders correctly', () => {
    const group = {
      id: 1,
      name: 'Foomunity',
      slug: 'foo',
      locationObject: 'Fuji',
      description: 'Great group',
      avatarUrl: 'avatar.png',
      bannerUrl: 'avatar.png',
      customViews: [{
        activePostsOnly: false,
        externalLink: 'https://google.com',
        icon: 'Public',
        isActive: true,
        name: 'custommm baby',
        order: 1,
        postTypes: [],
        topics: [],
        type: 'externalLink'
      }]
    }
    const wrapper = shallow(<GroupSettingsTab group={group} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('.save-button').prop('color')).toEqual('gray')
    wrapper.setState({ changed: true })
    expect(wrapper.find('.save-button').prop('color')).toEqual('green')
  })
})
