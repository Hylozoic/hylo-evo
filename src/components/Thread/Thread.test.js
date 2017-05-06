import Thread from './Thread'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const match = { params: { threadId: '1' } }
  const thread = { id: '1' }
  const wrapper = shallow(<Thread match={match} thread={thread}/>)
  expect(wrapper).toMatchSnapshot()
})
