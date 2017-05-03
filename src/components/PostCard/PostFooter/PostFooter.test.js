import PostFooter, { commentCaption } from './PostFooter'
import { shallow } from 'enzyme'
import React from 'react'

const commenters = [
  {name: 'Joe Smith'},
  {name: 'Sue Jones'},
  {name: 'Scary Terry'},
  {name: 'John Larkin'}
]

describe('PostFooter', () => {
  it('does something', () => {
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
    expect(commentCaption([], 0)).toEqual('Be the first to comment')
    expect(commentCaption(commenters.slice(0, 1), 1)).toEqual('Joe commented')
    expect(commentCaption(commenters.slice(0, 2), 2)).toEqual('Joe and Sue commented')
    expect(commentCaption(commenters.slice(0, 3), 3)).toEqual('Joe, Sue and 1 other commented')
    expect(commentCaption(commenters.slice(0, 4), 4)).toEqual('Joe, Sue and 2 others commented')
  })
})
