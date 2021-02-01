import Comment from './Comment'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('components/HyloEditor/contentStateToHTML', () => any => any)

describe('Comment', () => {
  const props = {
    comment: {
      text: '<p>text of the comment</p>',
      creator: {
        id: 1,
        name: 'Joe Smith',
        avatarUrl: 'foo.jpg'
      },
      attachments: [],
      createdAt: new Date()
    },
    slug: 'foo'
  }

  it('renders correctly', () => {
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders correctly when editing', () => {
    const wrapper = shallow(<Comment {...props} />)
    wrapper.instance().setState({ editing: true })
    wrapper.update()
    expect(wrapper).toMatchSnapshot()
  })

  it('displays image attachments', () => {
    const comment = {
      ...props.comment,
      attachments: [
        { url: 'foo.png', attachmentType: 'image' }
      ]
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

  it('displays the remove menu when removeComment is defined', () => {
    const wrapper = shallow(<Comment {...props} removeComment={() => {}} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('editComment', () => {
    it('sets state.editing to true', () => {
      const wrapper = shallow(<Comment {...props} />)
      const instance = wrapper.instance()
      expect(instance.state.editing).toEqual(false)
      instance.editComment()
      expect(instance.state.editing).toEqual(true)
    })
  })

  describe('saveComment', () => {
    it('sets state.editing to false and calls props.updateComment', () => {
      const updateComment = jest.fn()
      const wrapper = shallow(<Comment {...props} updateComment={updateComment} />)
      const theText = 'lalala'
      const editorState = {        
        getCurrentContent: () => ({
          hasText: () => true,
          getPlainText: () => theText
        })
      }
      const instance = wrapper.instance()
      instance.setState({ editing: true })
      instance.saveComment(editorState)
      expect(instance.state.editing).toEqual(false)
      expect(updateComment).toHaveBeenCalled()
    })
  })
})
