import PostFooter, { commentCaption } from './PostFooter'
import { shallow } from 'enzyme'
import React from 'react'

const commenters = [
  {name: 'Joe Smith', id: '1'},
  {name: 'Sue Jones', id: '2'},
  {name: 'Scary Terry', id: '3'},
  {name: 'John Larkin', id: '4'}
]

const commentersUnsorted = [
  {name: 'Sue Jones', id: '2'},
  {name: 'Joe Smith', id: '1'}
]

describe('PostFooter', () => {
  it('matches the latest snapshot', () => {
    const wrapper = shallow(<PostFooter
      commenters={commenters}
      commentersTotal={4}
      votesTotal={3}
      myVote />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('commentCaption', () => {
  it('returns the correct text', () => {
    const currentUserId = '1'
    expect(commentCaption([], 0)).toEqual('Be the first to comment')
    expect(commentCaption(commenters.slice(0, 1), 1)).toEqual('Joe commented')
    expect(commentCaption(commenters.slice(0, 2), 2)).toEqual('Joe and Sue commented')
    expect(commentCaption(commenters.slice(0, 3), 3)).toEqual('Joe, Sue and 1 other commented')
    expect(commentCaption(commenters.slice(0, 4), 4)).toEqual('Joe, Sue and 2 others commented')
  })

  it('uses phrase You if commenter id is the currentUser id', () => {
    const currentUserId = '1'
    expect(commentCaption(commenters.slice(0, 1), 1, currentUserId)).toEqual('You commented')
  })

  it('will sort them so that the currentUser is listed first, if only 2 have commented', () => {
    const currentUserId = '1'
    expect(commentCaption(commentersUnsorted, 2, currentUserId)).toEqual('You and Sue commented')
  })

  it('will sort them so that the names of others come first, if more than 2 total have commented', () => {
    const currentUserId = '1'
    expect(commentCaption(commenters, 4, currentUserId)).toEqual('Sue, Scary and 2 others commented')
  })
})
