import DropdownButton from './DropdownButton'
import { shallow } from 'enzyme'
import React from 'react'

describe('DropdownButton', () => {
  it('renders correctly', () => {
    const props = {
      label: 'Log in',
      choices: [{label: 'one', value: 1}, {label: 'two', value: 2}],
      className: 'login'
    }
    const wrapper = shallow(<DropdownButton {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
