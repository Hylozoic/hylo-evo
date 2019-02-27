import Button from './Button'
import { shallow } from 'enzyme'
import React from 'react'

describe('Button', () => {
  it('renders correctly', () => {
    const props = {
      label: 'Log in',
      color: 'blue',
      hover: true,
      active: true,
      narrow: true,
      small: true,
      children: null,
      onClick: () => {},
      disabled: false,
      className: 'login'
    }
    const wrapper = shallow(<Button {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
