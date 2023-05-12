import SkillsSection from './SkillsSection'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

it('shows basic pills', () => {
  const skills = [{ id: 1, name: 'test' }, { id: 2, name: 'unclickable' }]

  const wrapper = shallow(<SkillsSection skills={skills} fetchMemberSkills={jest.fn()} />)
  expect(wrapper).toMatchSnapshot()
})

it('shows editable fields when isMe = true', () => {
  const skills = [{ id: 1, name: 'test' }, { id: 2, name: 'unclickable' }]
  const isMe = true

  const wrapper = shallow(<SkillsSection skills={skills} fetchMemberSkills={jest.fn()} isMe={isMe} />)
  expect(wrapper).toMatchSnapshot()
})
