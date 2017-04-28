import Messages from './Messages'
import { shallow } from 'enzyme'
import React from 'react'

it('matches the last snapshot', () => {
  const match = { params: { threadId: '1' } }
  const wrapper = shallow(<Messages match={match} />)
  expect(wrapper).toMatchSnapshot()
})
