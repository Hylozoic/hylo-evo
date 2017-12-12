import PostDetail from './PostDetail'
import { shallow } from 'enzyme'
import React from 'react'

describe('PostDetail', () => {
  it('renders correctly', () => {
    const imageUrl = 'foo.jpg'
    const tags = ['singing', 'dancing']
    const details = 'the body of the post'
    const votesTotal = 7
    const slug = 'foo'
    const myVote = true

    const post = {
      id: '91',
      imageUrl,
      tags,
      details,
      votesTotal,
      myVote
    }

    const wrapper = shallow(<PostDetail post={post} fetchPost={jest.fn()} slug={slug} showCommunity />)
    expect(wrapper).toMatchSnapshot()
  })
})
