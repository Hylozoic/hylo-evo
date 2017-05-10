import NotificationsDropdown, { Thread } from './NotificationsDropdown'
import { shallow } from 'enzyme'
import React from 'react'

const u1 = {id: 1, name: 'Charles Darwin', avatarUrl: 'foo.png'}
const u2 = {id: 2, name: 'Marie Curie', avatarUrl: 'bar.png'}
const u3 = {id: 3, name: 'Arthur Fonzarelli', avatarUrl: 'baz.png'}

const threads = [
  {
    id: 2,
    messages: [{text: 'hi', creator: {id: 2}}],
    participants: [u1, u2, u3],
    updatedAt: new Date('2017-05-07T03:24:00')
  },
  {
    id: 1,
    messages: [{text: 'there', creator: {id: 3}}],
    participants: [u1, u2, u3],
    updatedAt: new Date('1995-12-17T03:23:00')
  }
]

describe.skip('NotificationsDropdown', () => {
  it('renders correctly with an empty list', () => {
    const wrapper = shallow(<NotificationsDropdown threads={[]} currentUser={u1} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a list of threads', () => {
    const wrapper = shallow(<NotificationsDropdown threads={threads} currentUser={u1} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe.skip('Thread', () => {
  it('renders correctly with an empty thread', () => {
    const wrapper = shallow(<Thread thread={{messages: []}} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly with a message', () => {
    const mockNavigate = jest.fn()
    const goToThread = i => () => mockNavigate(i)
    const wrapper = shallow(
      <Thread thread={threads[0]} currentUserId={u1.id} goToThread={goToThread} />)
    expect(wrapper.find('RoundImageRow').prop('imageUrls')).toEqual(['bar.png', 'baz.png'])
    expect(wrapper.find('div').at(2).text()).toEqual('Marie Curie and Arthur Fonzarelli')
    expect(wrapper.find('div').at(3).text()).toEqual('hi')
    wrapper.simulate('click')
    expect(mockNavigate).toHaveBeenCalledWith(threads[0].id)
  })
})
