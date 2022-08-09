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
        name: 'custommm baby',
        icon: 'Public',
        postTypes: [],
        activePostsOnly: false,
        externalLink: 'https://google.com',
        viewMode: 'externalLink',
        isActive: true,
        order: 1,
        topics: []
      }]
    }
    const wrapper = shallow(<GroupSettingsTab group={group} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('Button[label="Save Changes"]').prop('color')).toEqual('gray')
    wrapper.setState({ changed: true })
    expect(wrapper.find('Button[label="Save Changes"]').prop('color')).toEqual('green')
  })
})
