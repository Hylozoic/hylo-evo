import MessageSection from './MessageSection'
import { shallow } from 'enzyme'
import React from 'react'

const person1 = {id: 1, name: 'City Bob'}
const person2 = {id: 2, name: 'Country Alice'}

const messages = [
  {
    id: 1,
    creator: person1,
    text: 'hi!',
    createdAt: '2017-05-19T23:24:58Z'
  },
  {
    id: 2,
    creator: person1,
    text: 'how are you?',
    createdAt: '2017-05-19T23:25:07Z'
  },
  {
    id: 3,
    creator: person1,
    text: 'long time no see',
    createdAt: '2017-05-19T23:33:58Z'
  },
  {
    id: 4,
    creator: person2,
    text: 'i am great',
    createdAt: '2017-05-20T00:11:11Z'
  },
  {
    id: 5,
    creator: person2,
    text: 'things are great',
    createdAt: '2017-05-20T00:12:12Z'
  },
  {
    id: 6,
    creator: person2,
    text: 'so great',
    createdAt: '2017-05-20T00:23:12Z'
  },
  {
    id: 7,
    creator: person1,
    text: 'great!',
    createdAt: '2017-05-20T00:23:27Z'
  }
]

it('renders as expected', () => {
  const wrapper = shallow(<MessageSection messages={messages} />)
  expect(wrapper).toMatchSnapshot()
})

it('fetches messages when the socket reconnects')
it('scrolls to show a new message if already at the bottom')
it('marks messages as read when scrolling to the bottom')
it('defers marking new messages as read if the page is not visible')
