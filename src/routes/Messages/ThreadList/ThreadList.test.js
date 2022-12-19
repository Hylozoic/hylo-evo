import ThreadList, { ThreadListItem } from './ThreadList'
import { shallow } from 'enzyme'
import React from 'react'
import orm from 'store/models'

jest.mock('react-i18next', () => ({
  // this mock makes sure any components using the translate HoC receive the t function as a prop
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: () => '' }
    return Component
  }
}))

describe('ThreadList', () => {
  it('matches the last snapshot', () => {
    const match = { params: {} }
    const wrapper = shallow(<ThreadList threads={[]} fetchThreads={jest.fn()} match={match} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ThreadListItem', () => {
  var MessageThread, Person
  const currentUser = { id: 2, name: 'Ra', avatarUrl: 'ra.png' }

  beforeEach(() => {
    const session = orm.session(orm.getEmptyState())
    MessageThread = session.MessageThread
    Person = session.Person
  })

  it('matches the last snapshot', () => {
    const props = {
      currentUser,
      thread: MessageThread.create({
        participants: [
          { id: 1, name: 'Jo', avatarUrl: 'jo.png' },
          currentUser,
          { id: 3, name: 'La', avatarUrl: 'la.png' }
        ].map(p => Person.create(p))
      })
    }

    const wrapper = shallow(<ThreadListItem {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches the last snapshot with 2 participants', () => {
    const props = {
      currentUser,
      thread: MessageThread.create({
        participants: [
          { id: 1, name: 'Jo', avatarUrl: 'jo.png' },
          currentUser
        ].map(p => Person.create(p))
      })
    }

    const wrapper = shallow(<ThreadListItem {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches the last snapshot with just you', () => {
    const props = {
      currentUser,
      thread: MessageThread.create({
        participants: [
          currentUser
        ].map(p => Person.create(p))
      })
    }

    const wrapper = shallow(<ThreadListItem {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
