import PeopleSelectorMatches from './PeopleSelectorMatches'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<PeopleSelectorMatches />)
  expect(wrapper).toMatchSnapshot()
})
