import React from 'react'
import { shallow } from 'enzyme'
import AddLocation from './AddLocation'

describe('AddLocation', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<AddLocation />)
    expect(wrapper).toMatchSnapshot()
  })
})
