import React from 'react'
import { shallow } from 'enzyme'
import Domain from './Domain'

describe('Domain', () => {
  const communityDomain = 'communityDomain'
  it('renders correctly', () => {
    const wrapper = shallow(<Domain
      communityDomain={communityDomain}
      goToNextStep={jest.fn()}
      goToPreviousStep={jest.fn()}
      addCommunityDomain={jest.fn()}
      fetchCommunity={jest.fn()}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
