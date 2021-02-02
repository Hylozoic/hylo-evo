import React from 'react'
import { shallow } from 'enzyme'
import Review, { ReviewTextInput } from './Review'

describe('Review', () => {
  it('renders correctly', () => {
    const groupName = 'groupName'
    const groupDomain = 'groupDomain'
    const groupPrivacy = 'groupPrivacy'

    const wrapper = shallow(<Review
      goToNextStep={jest.fn()}
      goToPrivacyStep={jest.fn()}
      currentUser={{}}
      fetchMySkills={jest.fn()}
      groupName={groupName}
      groupDomain={groupDomain}
      groupPrivacy={groupPrivacy}
      goHome={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ReviewTextInput', () => {
  it('renders correctly', () => {
    const label = 'label'
    const value = 'value'
    const readOnly = false

    const wrapper = shallow(<ReviewTextInput
      label={label}
      value={value}
      readOnly={readOnly}
      editHandler={jest.fn()}
      onChange={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
