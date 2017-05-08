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
    expect(commentCaption(undefined, [], 0)).toEqual('Be the first to comment')
    expect(commentCaption(undefined, commenters.slice(0, 1), 1)).toEqual('Joe commented')
    expect(commentCaption(currentUserId, commenters.slice(0, 1), 1)).toEqual('You commented')
    expect(commentCaption(undefined, commenters.slice(0, 2), 2)).toEqual('Joe and Sue commented')
    expect(commentCaption(undefined, commenters.slice(0, 3), 3)).toEqual('Joe, Sue and 1 other commented')
    expect(commentCaption(undefined, commenters.slice(0, 4), 4)).toEqual('Joe, Sue and 2 others commented')
  })

  it('will sort them so that the currentUser is listed first', () => {
    const currentUserId = '1'
    expect(commentCaption(currentUserId, commentersUnsorted, 2)).toEqual('You and Sue commented')
  })
})
