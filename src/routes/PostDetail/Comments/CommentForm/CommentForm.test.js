import CommentForm from './CommentForm'
import { shallow } from 'enzyme'
import React from 'react'
import Me from 'store/models/Me'

const minDefaultProps = {
  postId: 'new',
  createComment: () => {},
  currentUser: new Me({
    name: 'Jen Smith',
    avatarUrl: 'foo.png'
  }),
  sendIsTyping: () => {},
  addAttachment: () => {},
  clearAttachments: () => {},
  attachments: []
}

describe('CommentForm', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<CommentForm {...minDefaultProps} />)
    expect(wrapper.find('Connect(HyloEditor)').length).toEqual(1)
    expect(wrapper.find('Connect(HyloEditor)').prop('placeholder'))
      .toEqual('Add a comment...')
  })
})
