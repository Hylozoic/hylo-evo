import React from 'react'
import { shallow } from 'enzyme'
import Domain from './Domain'

describe('Domain', () => {
  it('renders correctly', () => {
    const communityDomain = 'communityDomain'
    const wrapper = shallow(<Domain
      communityDomain={communityDomain}
      goToNextStep={jest.fn()}
      goToPreviousStep={jest.fn()}
      addCommunityDomain={jest.fn()}
      fetchCommunity={jest.fn()}
      goHome={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
