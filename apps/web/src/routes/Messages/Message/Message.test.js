import Message from './Message'
import { shallow } from 'enzyme'
import React from 'react'

it('to match the latest snapshot', () => {
  const message = {
    id: '1',
    text: 'test',
    creator: {
      id: '1',
      name: 'Good Person',
      avatarUrl: 'http://avatar.com/i.png'
    }
  }
  const wrapper = shallow(<Message message={message} isHeader />)
  expect(wrapper).toMatchSnapshot()
})

it('to match the latest non-header snapshot', () => {
  const message = {
    id: '1',
    text: 'test',
    creator: {
      id: '1',
      name: 'Good Person',
      avatarUrl: 'http://avatar.com/i.png'
    }
  }
  const wrapper = shallow(<Message message={message} />)
  expect(wrapper).toMatchSnapshot()
})

it('to display sending... when message is still in optimistic state', () => {
  const message = {
    id: 'messageThread12_1',
    text: 'test',
    creator: {
      id: '1',
      name: 'Good Person',
      avatarUrl: 'http://avatar.com/i.png'
    }
  }
  const wrapper = shallow(<Message message={message} isHeader />)
  expect(wrapper).toMatchSnapshot()
})
