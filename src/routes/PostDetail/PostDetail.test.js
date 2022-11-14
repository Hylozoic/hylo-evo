import PostDetail from './PostDetail'
import { shallow } from 'enzyme'
import React from 'react'

describe('PostDetail', () => {
  it('renders correctly', () => {
    const imageUrl = 'foo.jpg'
    const tags = ['singing', 'dancing']
    const details = 'the body of the post'
    const peopleReactedTotal = 7
    const routeParams = {
      slug: 'foo'
    }
    const myVote = true

    const post = {
      id: '91',
      attachments: [],
      imageUrl,
      tags,
      details,
      peopleReactedTotal,
      myVote,
      members: []
    }

    const wrapper = shallow(<PostDetail
      post={post}
      routeParams={routeParams}
      fetchPost={jest.fn()} />)
    expect(wrapper).toMatchSnapshot()
  })
})
