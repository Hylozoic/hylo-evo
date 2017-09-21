import Comment from './Comment'
import { shallow } from 'enzyme'
import React from 'react'

describe('Comment', () => {
  const props = {
    comment: {
      text: '<p>text of the comment</p>',
      creator: {
        id: 1,
        name: 'Joe Smith',
        avatarUrl: 'foo.jpg'
      },
      createdAt: new Date()
    },
    slug: 'foo'
  }

  it('renders correctly', () => {
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('displays an image', () => {
    const comment = {
      ...props.comment,
      image: {url: 'foo.png'}
    }
    const wrapper = shallow(<Comment comment={comment} slug={props.slug} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('sanitizes text', () => {
    const comment = {
      ...props.comment,
      text: '<p>Nice text<script>a sneaky script</script></p>'
    }
    const wrapper = shallow(<Comment comment={comment} />)
    expect(wrapper.find('div #text').prop('dangerouslySetInnerHTML')).toEqual({
      __html: '<p>Nice text</p>'
    })
  })

  it('displays the delete menu when deleteComment is defined', () => {
    const wrapper = shallow(<Comment {...props} deleteComment={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })
})
