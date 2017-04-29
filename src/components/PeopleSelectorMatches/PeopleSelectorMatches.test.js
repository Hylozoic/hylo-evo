import { shallow } from 'enzyme'
import React from 'react'

import PeopleSelectorMatches from './PeopleSelectorMatches'

it('does something', () => {
  const wrapper = shallow(<PeopleSelectorMatches />)
  expect(wrapper).toMatchSnapshot()
})
