import { shallow } from 'enzyme'
import React from 'react'

import SelectorMatchedItem from './SelectorMatchedItem'

it('matches last snapshot', () => {
  const wrapper = shallow(<SelectorMatchedItem />)
  expect(wrapper).toMatchSnapshot()
})
