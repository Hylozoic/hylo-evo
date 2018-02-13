import Switch from './Button'
import { shallow } from 'enzyme'
import React from 'react'

describe('Switch', () => {
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
    const wrapper = shallow(<Switch {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
