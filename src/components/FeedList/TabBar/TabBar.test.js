import { shallow } from 'enzyme'
import React from 'react'
import { render } from 'util/testing/reactTestingLibraryExtended'

import TabBar from './TabBar'

it('renders sort options', () => {
  const wrapper = shallow(<TabBar />)
  expect(wrapper).toMatchSnapshot()
})
