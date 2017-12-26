import NonAuthLayout from './NonAuthLayout'
import { shallow } from 'enzyme'
import React from 'react'

describe('NonAuthLayout', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<NonAuthLayout />)
    expect(wrapper).toMatchSnapshot()
  })
})
