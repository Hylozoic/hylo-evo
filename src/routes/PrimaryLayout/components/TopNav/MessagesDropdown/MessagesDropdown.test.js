import MessagesDropdown, { MessagesDropdownItem } from './MessagesDropdown'
 import { shallow } from 'enzyme'
import React from 'react'
import orm from 'store/models'

const session = orm.mutableSession(orm.getEmptyState())
const { MessageThread, Message, Person } = session

const u1 = {id: '1', name: 'Charles Darwin', avatarUrl: 'foo.png'}
const u2 = {id: '2', name: 'Marie Curie', avatarUrl: 'bar.png'}
const u3 = {id: '3', name: 'Arthur Fonzarelli', avatarUrl: 'baz.png'}

;[u1, u2, u3].forEach(u => Person.create(u))

const threads = [
  {
    id: 2,
    participants: [u1, u2, u3].map(u => u.id),
    updatedAt: '2017-05-07T03:24:00'
  },
  {
    id: 1,
    participants: [u1, u2, u3].map(u => u.id),
    updatedAt: '1995-12-17T03:23:00'
  }
].map(t => MessageThread.create(t))

;[
  {text: 'hi', creator: u2.id, messageThread: threads[0].id},
  {text: 'there', creator: u3.id, messageThread: threads[1].id}
].map(m => Message.create(m))

describe('MessagesDropdown', () => {
  it('renders correctly with an empty list', () => {
    const wrapper = shallow(<MessagesDropdown
      renderToggleChildren={() => <span>click me</span>}
      threads={[]}
      currentUser={u1} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a list of threads', () => {
    const wrapper = shallow(<MessagesDropdown
      renderToggleChildren={() => <span>click me</span>}
      threads={threads}
      currentUser={u1} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('MessagesDropdownItem', () => {
  it('renders correctly with an empty thread', () => {
    const thread = new MessageThread({})
    const wrapper = shallow(<MessagesDropdownItem thread={thread} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a message', () => {
    const mockNavigate = jest.fn()
    const goToThread = i => mockNavigate(i)

    const wrapper = shallow(<MessagesDropdownItem
      thread={threads[0]} currentUser={u1} onClick={() => goToThread(threads[0].id)} />)
    expect(wrapper.find('RoundImageRow').prop('imageUrls')).toEqual(['bar.png', 'baz.png'])
    expect(wrapper.find('div').at(2).text()).toEqual('Marie Curie and Arthur Fonzarelli')
    expect(wrapper.find('div').at(3).text()).toEqual('hi')
    wrapper.simulate('click')
    expect(mockNavigate).toHaveBeenCalledWith(threads[0].id)
  })
})
