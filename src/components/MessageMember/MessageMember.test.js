import MessageMember from './MessageMember'
import React from 'react'
import { shallow } from 'enzyme'

it('returns Loading with no member', () => {
  const wrapper = shallow(<MessageMember />)
  expect(wrapper.find('Loading')).toHaveLength(1)
})

it('links to a new thread if no existing thread', () => {
  const member = { id: 77 }
  const wrapper = shallow(<MessageMember member={member} />)
  expect(wrapper.find('Link').prop('to')).toEqual('/t/new?participants=77')
})

it('links to existing thread if it exists', () => {
  const member = { id: 77, messageThreadId: 123 }
  const wrapper = shallow(<MessageMember member={member} />)
  expect(wrapper.find('Link').prop('to')).toEqual('/t/123')
})
