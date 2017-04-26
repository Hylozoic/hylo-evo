import { shallow } from 'enzyme'
import React from 'react'

import PeopleSelector from './PeopleSelector'

it('matches the last snapshot', () => {
  const wrapper = shallow(<PeopleSelector />)
  expect(wrapper).toMatchSnapshot()
})
