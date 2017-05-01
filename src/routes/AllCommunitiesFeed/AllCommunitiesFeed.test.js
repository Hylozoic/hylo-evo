import AllCommunitiesFeed from './AllCommunitiesFeed'
import { shallow } from 'enzyme'
import React from 'react'

it('renders as expected', () => {
  const wrapper = shallow(<AllCommunitiesFeed filter='request' />)
  expect(wrapper).toMatchSnapshot()
})
