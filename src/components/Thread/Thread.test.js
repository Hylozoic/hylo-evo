import Thread from './Thread'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const thread = {id: '1'}
  const wrapper = shallow(<Thread thread={thread} id='1' />)
  expect(wrapper).toMatchSnapshot()
})
