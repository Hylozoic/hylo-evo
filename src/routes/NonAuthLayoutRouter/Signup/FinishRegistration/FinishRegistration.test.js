import React from 'react'
import { shallow } from 'enzyme'
import FinishRegistration from './FinishRegistration'

describe('FinishRegistration', () => {
  const currentUser = { email: 'hi@bye.com', emailValidated: true, hasRegistered: false, name: 'Smiley' }

  it('renders correctly', () => {
    const wrapper = shallow(<FinishRegistration email='test@wheee.com' currentUser={currentUser} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with an error', () => {
    const wrapper = shallow(<FinishRegistration email='test@wheee.com' currentUser={currentUser} error='some error' />)
    expect(wrapper).toMatchSnapshot()
  })
})
