import NotificationSettings from './NotificationSettings'
import { shallow } from 'enzyme'
import React from 'react'

describe.skip('NotificationSettings', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<NotificationSettings currentUser={{}} />)
    expect(wrapper.find('Connect(ChangeImageButton)').length).toEqual(2)
    expect(wrapper.find('Control').length).toEqual(5)
    expect(wrapper.find('SocialControl').length).toEqual(3)
    expect(wrapper.find('Button').prop('color')).toEqual('gray')
    wrapper.setState({changed: true})
    expect(wrapper.find('Button').prop('color')).toEqual('green')
  })
})
