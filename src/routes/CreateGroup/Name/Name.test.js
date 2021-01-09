import React from 'react'
import { shallow } from 'enzyme'
import Name from './Name'

describe('Name', () => {
  const groupName = 'groupName'
  it('renders correctly', () => {
    const wrapper = shallow(<Name
      groupName={groupName}
      goToNextStep={jest.fn()}
      addGroupName={jest.fn()}
      goHome={jest.fn()}
      addNetworkId={() => {}}
    />)
    expect(wrapper).toMatchSnapshot()
  })
})
