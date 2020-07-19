import PostFooter, { peopleSetup } from './PostFooter'
import { shallow } from 'enzyme'
import React from 'react'

const commenters = [
  { name: 'Joe Smith', id: '1', avatarUrl: '' },
  { name: 'Sue Jones', id: '2', avatarUrl: '' },
  { name: 'Scary Terry', id: '3', avatarUrl: '' },
  { name: 'John Larkin', id: '4', avatarUrl: '' }
]

const commentersUnsorted = [
  { name: 'Sue Jones', id: '2', avatarUrl: '' },
  { name: 'Joe Smith', id: '1', avatarUrl: '' }
]

describe('PostFooter', () => {
  it('matches the latest snapshot', () => {
    const wrapper = shallow(<PostFooter
      voteOnPost={() => {}}
      commenters={commenters}
      commentersTotal={4}
      votesTotal={3}
      myVote />)
    expect(wrapper).toMatchSnapshot()
  })

  it('enables tooltip when myvote is false', () => {
    const wrapper = shallow(<PostFooter
      voteOnPost={() => {}}
      commenters={commenters}
      commentersTotal={4}
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
      voteOnPost={() => {}}
      commenters={[]}
      commentersTotal={0}
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
      voteOnPost={() => {}}
      commenters={[]}
      commentersTotal={0}
      votesTotal={0}
      type='event' />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('commentCaption', () => {
  it('returns the correct text', () => {
    // const currentUserId = '1'
    expect(peopleSetup([], 0).caption).toEqual('Be the first to comment')
    expect(peopleSetup(commenters.slice(0, 1), 1).caption).toEqual('Joe commented')
    expect(peopleSetup(commenters.slice(0, 2), 2).caption).toEqual('Joe and Sue commented')
    expect(peopleSetup(commenters.slice(0, 3), 3).caption).toEqual('Joe, Sue and 1 other commented')
    expect(peopleSetup(commenters.slice(0, 4), 4).caption).toEqual('Joe, Sue and 2 others commented')
  })

  it('uses phrase You if commenter id is the currentUser id', () => {
    const currentUserId = '1'
    expect(peopleSetup(commenters.slice(0, 1), 1, currentUserId).caption).toEqual('You commented')
  })

  it('will sort them so that the currentUser is listed first, if only 2 have commented', () => {
    const currentUserId = '1'
    expect(peopleSetup(commentersUnsorted, 2, currentUserId).caption).toEqual('You and Sue commented')
  })

  it('will sort them so that the names of others come first, if more than 2 total have commented', () => {
    const currentUserId = '1'
    expect(peopleSetup(commenters, 4, currentUserId).caption).toEqual('Sue, Scary and 2 others commented')
  })
})
