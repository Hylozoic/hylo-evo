import PostFooter from './PostFooter'
import { shallow } from 'enzyme'
import React from 'react'

const commenters = [
  { name: 'Joe Smith', id: '1', avatarUrl: '' },
  { name: 'Sue Jones', id: '2', avatarUrl: '' },
  { name: 'Scary Terry', id: '3', avatarUrl: '' },
  { name: 'John Larkin', id: '4', avatarUrl: '' }
]

// const commentersUnsorted = [
//   { name: 'Sue Jones', id: '2', avatarUrl: '' },
//   { name: 'Joe Smith', id: '1', avatarUrl: '' }
// ]

describe('PostFooter', () => {
  it('matches the latest snapshot', () => {
    const wrapper = shallow(<PostFooter
      reactOnPost={() => {}}
      commenters={commenters}
      commentersTotal={4}
      currentUser={commenters[1]}
      votesTotal={3}
      myVote />)
    expect(wrapper).toMatchSnapshot()
  })

  it('enables tooltip when myvote is false', () => {
    const wrapper = shallow(<PostFooter
      reactOnPost={() => {}}
      commenters={commenters}
      commentersTotal={4}
      currentUser={commenters[1]}
      votesTotal={3}
      myVote={false} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches the latest snapshot for project', () => {
    const members = [{
      id: 1,
      name: 'Sarah Brown',
      avatarUrl: ''
    }]
    const wrapper = shallow(<PostFooter
      reactOnPost={() => {}}
      commenters={[]}
      commentersTotal={0}
      currentUser={commenters[1]}
      votesTotal={0}
      type='project'
      members={members} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches the latest snapshot for event', () => {
    // const eventInvitations = [
    //   {
    //     id: 1,
    //     name: 'Arthur Smith',
    //     response: 'yes'
    //   }
    // ]
    const wrapper = shallow(<PostFooter
      reactOnPost={() => {}}
      commenters={[]}
      commentersTotal={0}
      currentUser={null}
      votesTotal={0}
      type='event' />)
    expect(wrapper).toMatchSnapshot()
  })
})
