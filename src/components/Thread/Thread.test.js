import Thread from './Thread'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const wrapper = shallow(<Thread threadId='1' />)
  expect(wrapper).toMatchSnapshot()
})
