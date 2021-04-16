import GroupWelcomeModal from './GroupWelcomeModal'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<GroupWelcomeModal />)
  expect(wrapper).toMatchSnapshot()
})
