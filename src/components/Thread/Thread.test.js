import Thread, { Header } from './Thread'
import { shallow } from 'enzyme'
import React from 'react'

describe('Thread', () => {
  it('matches the last snapshot', () => {
    const thread = {id: '1'}
    const wrapper = shallow(<Thread thread={thread} id='1' />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('Header', () => {
  it('matches the last snapshot', () => {
    const currentUser = {id: 2, name: 'Ra', avatarUrl: 'ra.png'}
    const props = {
      id: '1',
      thread: {
        id: '1',
        participants: [
          {id: 1, name: 'Jo', avatarUrl: 'jo.png'},
          currentUser,
          {id: 3, name: 'La', avatarUrl: 'la.png'}
        ]
      },
      currentUser
    }
    const wrapper = shallow(<Header {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches the last snapshot when just 2 participants', () => {
    const currentUser = {id: 2, name: 'Ra', avatarUrl: 'ra.png'}
    const props = {
      id: '1',
      thread: {
        id: '1',
        participants: [
          {id: 1, name: 'Jo', avatarUrl: 'jo.png'},
          currentUser
        ]
      },
      currentUser
    }
    const wrapper = shallow(<Header {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches the last snapshot when just you', () => {
    const currentUser = {id: 2, name: 'Ra', avatarUrl: 'ra.png'}
    const props = {
      id: '1',
      thread: {
        id: '1',
        participants: [
          currentUser
        ]
      },
      currentUser
    }
    const wrapper = shallow(<Header {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
