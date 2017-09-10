import React from 'react'
import { shallow } from 'enzyme'
import Review, { ReviewTextInput } from './Review'

describe('Review', () => {
  it('renders correctly', () => {
    const communityName = 'communityName'
    const communityDomain = 'communityDomain'
    const communityPrivacy = 'communityPrivacy'

    const wrapper = shallow(<Review
      goToNextStep={jest.fn()}
      currentUser={{}}
      communityName={communityName}
      communityDomain={communityDomain}
      communityPrivacy={communityPrivacy}
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
