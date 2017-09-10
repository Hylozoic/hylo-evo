import React from 'react'
import { shallow } from 'enzyme'
import Review from './Review'

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
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
