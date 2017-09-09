import React from 'react'
import { shallow } from 'enzyme'
import AddSkills from './AddSkills'

describe('AddSkills', () => {
  it('renders correctly', () => {
    const skills = []
    const wrapper = shallow(<AddSkills skills={skills}/>)
    expect(wrapper).toMatchSnapshot()
  })
})
