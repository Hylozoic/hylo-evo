import React from 'react'
import { shallow } from 'enzyme'
import FinishRegistration from './FinishRegistration'

describe('FinishRegistration', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<FinishRegistration email='test@wheee.com' />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with an error', () => {
    const wrapper = shallow(<FinishRegistration email='test@wheee.com' error='some error' />)
    expect(wrapper).toMatchSnapshot()
  })
})
