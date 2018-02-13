import Switch from './Switch'
import { shallow } from 'enzyme'
import React from 'react'

describe('Switch', () => {
  it('renders correctly', () => {
    const props = {
      value: true,
      onClick: () => {},
      className: 'switch-class'
    }
    const wrapper = shallow(<Switch {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
