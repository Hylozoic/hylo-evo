import React from 'react'
import { shallow } from 'enzyme'
import WelcomeExplore from './WelcomeExplore'

describe('WelcomeExplore', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<WelcomeExplore currentUser={{ name: 'Tibet' }} />)
    expect(wrapper).toMatchSnapshot()
  })
})
