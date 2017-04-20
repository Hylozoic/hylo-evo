import MessageSection from './MessageSection'
import { shallow } from 'enzyme'
import React from 'react'

it('does something', () => {
  const wrapper = shallow(<MessageSection messages={[]} />)
  expect(wrapper).toMatchSnapshot()
})
