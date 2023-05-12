import CommentCard from './CommentCard'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  useTranslation: (domain) => {
    return {
      t: (str) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {})
      }
    }
  }
}))

const props = {
  comment: {
    text: '<p>text of the comment. a long one. text of the comment. a long one. text of the comment. a long one. text of the comment. a long one. text of the comment. a long one. text of the comment. a long one. Irrelevant Change</p>',
    creator: {
      id: 1,
      name: 'Joe Smith',
      avatarUrl: 'foo.jpg'
    },
    attachments: [],
    post: {
      id: 77,
      title: 'Awesome Sauce #hashtag'
    },
    createdAt: new Date()
  },
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
    expanded: true
  }
  const wrapper = shallow(<CommentCard {...differentProps} />)
  expect(wrapper).toMatchSnapshot()
})

it('displays image an image attachments', () => {
  const comment = {
    ...props.comment,
    attachments: [
      { url: 'jam.png', attachmentType: 'image' }
    ]
  }
  const wrapper = shallow(<CommentCard {...props} comment={comment} />)
  expect(wrapper).toMatchSnapshot()
})
