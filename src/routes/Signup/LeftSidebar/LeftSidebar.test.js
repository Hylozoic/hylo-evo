import React from 'react'
import { shallow } from 'enzyme'
import LeftSidebar from './LeftSidebar'

describe('LeftSidebar', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<LeftSidebar header={'header text'} body={'body text'} />)
    expect(wrapper).toMatchSnapshot()
  })
})
