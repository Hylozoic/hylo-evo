import TextInput from './TextInput'
import { shallow } from 'enzyme'
import React from 'react'

describe('TextInput', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<TextInput
      onChange={() => {}}
      value={'value'}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
