import React from 'react'
import { shallow } from 'enzyme'
import Signup from './Signup'

describe('Signup', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Signup />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders correctly with mobile redirect', () => {
    const url = 'some.url'
    const wrapper = shallow(<Signup downloadAppUrl={url} />)
    expect(wrapper).toMatchSnapshot()
  })
})
