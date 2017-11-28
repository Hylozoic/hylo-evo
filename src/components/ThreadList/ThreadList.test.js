import ThreadList, { ThreadListItem } from './ThreadList'
import { shallow } from 'enzyme'
import React from 'react'

describe('ThreadList', () => {
  it('matches the last snapshot', () => {
    const match = {params: {}}
    const wrapper = shallow(<ThreadList threads={[]} match={match} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ThreadListItem', () => {
  const currentUser = {id: 2, name: 'Ra', avatarUrl: 'ra.png'}
  it('matches the last snapshot', () => {
    const props = {
      currentUser,
      participants: [
        {id: 1, name: 'Jo', avatarUrl: 'jo.png'},
        currentUser,
        {id: 3, name: 'La', avatarUrl: 'la.png'}
      ]
    }

    const wrapper = shallow(<ThreadListItem {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches the last snapshot with 2 participants', () => {
    const props = {
      currentUser,
      participants: [
        {id: 1, name: 'Jo', avatarUrl: 'jo.png'},
        currentUser
      ]
    }

    const wrapper = shallow(<ThreadListItem {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches the last snapshot with just you', () => {
    const props = {
      currentUser,
      participants: [
        currentUser
      ]
    }

    const wrapper = shallow(<ThreadListItem {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
