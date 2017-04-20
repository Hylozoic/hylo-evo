import Message from './Message'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const wrapper = shallow(<Message message={{}} />)
  expect(wrapper).toMatchSnapshot()
})
