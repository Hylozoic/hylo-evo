import MessagesDropdown, { Thread } from './MessagesDropdown'
import { shallow } from 'enzyme'
import React from 'react'

const u1 = {id: 1, avatarUrl: 'foo.png'}
const u2 = {id: 2, avatarUrl: 'bar.png'}
const u3 = {id: 3, avatarUrl: 'baz.png'}

const threads = [
  {
    id: 2,
    messages: [{text: 'hi'}],
    participants: [u1, u2, u3],
    updatedAt: new Date('2017-05-07T03:24:00')
  },
  {
    id: 1,
    messages: [{text: 'there'}],
    participants: [u1, u2, u3],
    updatedAt: new Date('1995-12-17T03:23:00')
  }
]

describe('MessagesDropdown', () => {
  it('renders correctly with an empty list', () => {
    const wrapper = shallow(<MessagesDropdown threads={[]} currentUser={u1} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a list of threads', () => {
    const wrapper = shallow(<MessagesDropdown threads={threads} currentUser={u1} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('Thread', () => {
  it('renders correctly with an empty thread', () => {
    const wrapper = shallow(<Thread thread={{messages: []}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a message', () => {
    const mockNavigate = jest.fn()
    const goToThread = i => () => mockNavigate(i)
    const wrapper = shallow(
      <Thread thread={threads[0]} currentUser={u1} goToThread={goToThread} />)
    expect(wrapper).toMatchSnapshot()
    // wrapper.simulate('clicks')
    // expect(mockNavigate).toHaveBeenCalledWith(i)
  })
})
