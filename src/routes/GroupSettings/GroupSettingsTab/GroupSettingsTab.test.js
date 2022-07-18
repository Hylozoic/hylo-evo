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
      customViews: { items: [] }
    }
    const wrapper = shallow(<GroupSettingsTab group={group} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('Button').prop('color')).toEqual('gray')
    wrapper.setState({ changed: true })
    expect(wrapper.find('Button').prop('color')).toEqual('green')
  })
})
