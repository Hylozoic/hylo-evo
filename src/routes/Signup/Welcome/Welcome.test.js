import React from 'react'
import { shallow } from 'enzyme'
import Welcome from './Welcome'

describe('Welcome', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Welcome currentUser={{ name: "Tibet" }} />)
    expect(wrapper).toMatchSnapshot()
  })
})
