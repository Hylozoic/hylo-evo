import SkillsToLearnSection from './SkillsToLearnSection'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

it('shows basic pills', () => {
  const skills = [{ id: 1, name: 'test' }, { id: 2, name: 'unclickable' }]

  const wrapper = shallow(<SkillsToLearnSection skills={skills} fetchMemberSkills={jest.fn()} />)
  expect(wrapper).toMatchSnapshot()
})

it('shows editable fields when isMe = true', () => {
  const skills = [{ id: 1, name: 'test' }, { id: 2, name: 'unclickable' }]
  const isMe = true

  const wrapper = shallow(<SkillsToLearnSection skills={skills} fetchMemberSkills={jest.fn()} isMe={isMe} />)
  expect(wrapper).toMatchSnapshot()
})
