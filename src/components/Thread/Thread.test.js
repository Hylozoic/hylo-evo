import Thread from './Thread'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const match = { params: { threadId: '1' } }
  const wrapper = shallow(<Thread match={match} />)
  expect(wrapper).toMatchSnapshot()
})
