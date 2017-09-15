import React from 'react'
import { shallow } from 'enzyme'
import Privacy from './Privacy'

describe('Privacy', () => {
  it('renders correctly', () => {
    const communityPrivacy = 'communityPrivacy'

    const wrapper = shallow(<Privacy
      goToNextStep={jest.fn()}
      currentUser={{}}
      goToPreviousStep={jest.fn()}
      addCommunityPrivacy={jest.fn()}
      communityPrivacy={communityPrivacy}
      goHome={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
