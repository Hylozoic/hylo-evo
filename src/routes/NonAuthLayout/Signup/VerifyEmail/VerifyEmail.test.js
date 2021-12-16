import React from 'react'
import { shallow } from 'enzyme'
import VerifyEmail from './VerifyEmail'

describe('VerifyEmail', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<VerifyEmail email='test@wheee.com' />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with an error', () => {
    const wrapper = shallow(<VerifyEmail email='test@wheee.com' error='some error' />)
    expect(wrapper).toMatchSnapshot()
  })
})
