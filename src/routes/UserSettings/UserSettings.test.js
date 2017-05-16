import UserSettings from './UserSettings'
import { shallow } from 'enzyme'
import React from 'react'

describe('UserSettings', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<UserSettings />)
    expect(wrapper).toMatchSnapshot()
  })
})
