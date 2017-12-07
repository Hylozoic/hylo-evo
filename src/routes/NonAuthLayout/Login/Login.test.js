import React from 'react'
import { shallow } from 'enzyme'
import Login from './Login'

describe('Login', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<Login />)
    expect(wrapper).toMatchSnapshot()
  })
  it('renders download app modal correctly', () => {
    const downloadAppUrl = 'some-url.com'
    const wrapper = shallow(<Login downloadAppUrl={downloadAppUrl} />)
    expect(wrapper).toMatchSnapshot()
  })
})
