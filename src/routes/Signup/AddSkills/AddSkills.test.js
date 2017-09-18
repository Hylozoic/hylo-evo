import React from 'react'
import { shallow } from 'enzyme'
import AddSkills from './AddSkills'

describe('AddSkills', () => {
  it('renders correctly', () => {
    const skills = ['Dancing', 'Running', 'Hiding']
    const wrapper = shallow(<AddSkills skills={skills} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('responds to interaction', () => {
    const addSkill = jest.fn()
    const skills = ['Dancing', 'Running', 'Hiding']
    const wrapper = shallow(<AddSkills skills={skills} addSkill={addSkill} />)
    const firstPill = wrapper.find('Pill').at(0)
    const firstSkill = firstPill.props().skill.name
    expect(addSkill).not.toHaveBeenCalled()
    firstPill.dive().simulate('click')
    expect(addSkill).toHaveBeenCalledWith(firstSkill)

    const otherPill = wrapper.find('Pill#other-pill')
    expect(wrapper.state().editing).toBeFalsy()
    otherPill.dive().simulate('click')
    expect(wrapper.state().editing).toBeTruthy()
  })
})
