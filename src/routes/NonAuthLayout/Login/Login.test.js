import Login from './Login'
import { shallow } from 'enzyme'
import React from 'react'

describe('Login', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Login />)
    expect(wrapper).toMatchSnapshot()
  })
})
