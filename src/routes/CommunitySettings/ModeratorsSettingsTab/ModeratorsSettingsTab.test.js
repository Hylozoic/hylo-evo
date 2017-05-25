import CommunitySettings, { CommunityControl } from './CommunitySettings'
import { shallow } from 'enzyme'
import React from 'react'

describe.skip('ModeratorsSettingsTab', () => {
  it('renders a list of CommunityControls', () => {
    const communities = [
      {id: 1},
      {id: 2},
      {id: 3},
      {id: 4}
    ]
    const wrapper = shallow(<CommunitySettings communities={communities} />)
    expect(wrapper.find('CommunityControl').length).toEqual(4)
  })
})

describe.skip('CommunityControl', () => {
  it('renders correctly', () => {
    const community = {
      name: 'Foomunity'
    }
    const wrapper = shallow(<CommunityControl community={community} />)
    expect(wrapper.find('Link').length).toEqual(2)
    expect(wrapper.find('Link').get(1).props.children).toEqual(community.name)
  })
})
