import AccountSettings, { Control, SocialControl } from './AccountSettings'
import { shallow } from 'enzyme'
import React from 'react'

describe('AccountSettings', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AccountSettings currentUser={{}} />)
    expect(wrapper.find('Connect(ChangeImageButton)').length).toEqual(2)
    expect(wrapper.find('Control').length).toEqual(5)
    expect(wrapper.find('SocialControl').length).toEqual(3)
    expect(wrapper.find('Button').prop('color')).toEqual('gray')
    wrapper.setState({changed: true})
    expect(wrapper.find('Button').prop('color')).toEqual('green')
  })
})

describe('Control', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Control label='A Control' value='the value' />)
    expect(wrapper.find('label').text()).toEqual('A Control')
    expect(wrapper.find('input').prop('value')).toEqual('the value')
  })
})

describe('SocialControl', () => {
  it('renders correctly without a value', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' />)
    expect(wrapper.text()).toEqual('A Social ControlLink')
  })

  it('renders correctly with a value', () => {
    const wrapper = shallow(<SocialControl label='A Social Control' value='someurl.com'/>)
    expect(wrapper.text()).toEqual('A Social ControlUnlink')
  })
})
