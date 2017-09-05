import React from 'react'
import { shallow } from 'enzyme'
import AddSkills from './AddSkills'

describe('AddSkills', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AddSkills />)
    expect(wrapper).toMatchSnapshot()
  })
})
