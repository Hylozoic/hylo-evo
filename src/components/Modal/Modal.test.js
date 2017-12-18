import Modal from './Modal'
import { shallow } from 'enzyme'
import React from 'react'

it('renders correctly', () => {
  const wrapper = shallow(<Modal />)
  expect(wrapper).toMatchSnapshot()
})
