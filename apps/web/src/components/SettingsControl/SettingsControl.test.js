import SettingsControl from './SettingsControl'
import { shallow } from 'enzyme'
import React from 'react'

describe('SettingsControl', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<SettingsControl label='A Control' value='the value' />)
    expect(wrapper.find('label').text()).toEqual('A Control')
    expect(wrapper.find('input').prop('value')).toEqual('the value')
  })
})
