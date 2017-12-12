import React from 'react'
import { shallow } from 'enzyme'
import PasswordReset from './PasswordReset'

describe('Signup', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<PasswordReset />, { disableLifecycleMethods: true })
    expect(wrapper).toMatchSnapshot()
  })
})
