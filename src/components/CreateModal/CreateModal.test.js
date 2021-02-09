import CreateModal from './CreateModal'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<CreateModal />)
  expect(wrapper).toMatchSnapshot()
})
