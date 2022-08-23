import Comments from './Comments'
import ShowMore from './ShowMore'
import { shallow } from 'enzyme'
import React from 'react'

describe('Comments', () => {
  it('renders correctly', () => {
    const props = {
      currentUser: { id: 1},
      comments: [{ id: 1, parentComment: null }, { id: 2, parentComment: null }, { id: 3, parentComment: null }],
      total: 9,
      hasMore: true,
      postId: '91',
      slug: 'foo'
    }
    const wrapper = shallow(<Comments {...props} />, { disableLifecycleMethods: true })
    expect(wrapper.find('ShowMore').length).toEqual(1)
    expect(wrapper.find('ShowMore').prop('commentsLength')).toEqual(3)
    expect(wrapper.find('Connect(CommentWithReplies)').length).toEqual(3)
    const comment = wrapper.find('Connect(CommentWithReplies)').at(0)
    expect(comment.prop('comment')).toEqual(props.comments[0])
    expect(comment.prop('slug')).toEqual(props.slug)
    expect(wrapper.find('Connect(CommentForm)').length).toEqual(1)
  })
})

describe('ShowMore', () => {
  it('returns null when hasMore is false', () => {
    const props = {
      hasMore: false
    }
    const wrapper = shallow(<ShowMore {...props} />)
    expect(wrapper.find('div').length).toEqual(0)
  })

  it('renders correctly', () => {
    const props = {
      commentsLength: 4,
      total: 11,
      hasMore: true
    }
    const wrapper = shallow(<ShowMore {...props} />)
    expect(wrapper.find('div').length).toEqual(1)
    expect(wrapper.find('div').text()).toEqual('View 7 previous comments')
  })
})
