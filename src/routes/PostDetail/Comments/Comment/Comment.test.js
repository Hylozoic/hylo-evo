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
    expect(wrapper.find('Avatar').length).toEqual(1)
    expect(wrapper.find('Avatar').prop('avatarUrl')).toEqual(props.comment.creator.avatarUrl)
    expect(wrapper.find('Link').length).toEqual(1)
    expect(wrapper.find('div #text').length).toEqual(1)
    expect(wrapper.find('div #text').prop('dangerouslySetInnerHTML')).toEqual({
      __html: props.comment.text
    })
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
})
