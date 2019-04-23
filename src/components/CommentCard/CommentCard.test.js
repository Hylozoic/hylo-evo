import CommentCard from './CommentCard'
import { shallow } from 'enzyme'
import React from 'react'

const props = {
  comment: {
    text: '<p>text of the comment. a long one. text of the comment. a long one. text of the comment. a long one. text of the comment. a long one. text of the comment. a long one. text of the comment. a long one. Irrelevant Change</p>',
    creator: {
      id: 1,
      name: 'Joe Smith',
      avatarUrl: 'foo.jpg'
    },
    post: {
      id: 77,
      title: 'Awesome Sauce #hashtag'
    },
    createdAt: new Date()
  },
  shouldShowReply: false,
  expanded: false,
  highlightProps: { term: 'foo' }
}

it('matches last snapshot', () => {
  const wrapper = shallow(<CommentCard {...props} />)
  expect(wrapper).toMatchSnapshot()
})

it('matches last snapshot with different config', () => {
  const differentProps = {
    ...props,
    shouldShowReply: true,
    expanded: true
  }
  const wrapper = shallow(<CommentCard {...differentProps} />)
  expect(wrapper).toMatchSnapshot()
})

it('displays an image', () => {
  const comment = {
    ...props.comment,
    image: { url: 'jam.png' }
  }
  const wrapper = shallow(<CommentCard {...props} comment={comment} />)
  expect(wrapper).toMatchSnapshot()
})
