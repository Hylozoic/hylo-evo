import React from 'react'
import { shallow } from 'enzyme'
import Name from './Name'

describe('Name', () => {
  const communityName = 'communityName'
  it('renders correctly', () => {
    const wrapper = shallow(<Name
      communityName={communityName}
      goToNextStep={jest.fn()}
      addCommunityName={jest.fn()}
      goHome={jest.fn()}
      addNetworkId={() => {}}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
