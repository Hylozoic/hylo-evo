import CommunityDeleteConfirmation from './CommunityDeleteConfirmation'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const wrapper = shallow(<CommunityDeleteConfirmation />)
  expect(wrapper).toMatchSnapshot()
})
