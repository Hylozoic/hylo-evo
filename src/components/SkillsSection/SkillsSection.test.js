import SkillsSection from './SkillsSection'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<SkillsSection />)
  expect(wrapper).toMatchSnapshot()
})
