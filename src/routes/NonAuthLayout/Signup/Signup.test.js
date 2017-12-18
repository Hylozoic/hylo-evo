import React from 'react'
import { shallow } from 'enzyme'
import Signup from './Signup'

describe('Signup', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Signup />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders download app modal correctly', () => {
    const downloadAppUrl = 'some-url.com'
    const wrapper = shallow(<Signup downloadAppUrl={downloadAppUrl} />)
    expect(wrapper).toMatchSnapshot()
  })
})
