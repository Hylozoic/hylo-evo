import CommentForm from './CommentForm'
import { shallow } from 'enzyme'
import React from 'react'
import Me from 'store/models/Me'

describe('CommentForm', () => {
  it('renders correctly', () => {
    const currentUser = new Me({
      name: 'Jen Smith',
      avatarUrl: 'foo.png'
    })
    const wrapper = shallow(<CommentForm currentUser={currentUser} />)
    expect(wrapper.find('Connect(HyloEditor)').length).toEqual(1)
    expect(wrapper.find('Connect(HyloEditor)').prop('placeholder'))
      .toEqual("Hi Jen, what's on your mind?")
  })
})
