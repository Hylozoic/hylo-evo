import { Comment } from './Comment'
import { shallow } from 'enzyme'
import React from 'react'

jest.mock('components/HyloEditor/HyloContentState', () => ({
  toHTML: () => any => any
}))

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
      createdAt: new Date(),
      childComments: []
    },
    canModerate: false,
    currentUser: {
      id: 2
    },
    slug: 'foo',
    updateComment: jest.fn(),
    deleteComment: jest.fn(),
    removeComment: jest.fn(),
    onReplyComment: jest.fn()
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
    const wrapper = shallow(<Comment {...props} comment={comment} />)
    expect(wrapper).toMatchSnapshot()
  })

<<<<<<< HEAD
=======
  it('sanitizes text', () => {
    const comment = {
      ...props.comment,
      text: '<p>Nice text<script>a sneaky script</script></p>'
    }
    const wrapper = shallow(<Comment {...props} comment={comment} />)
    expect(wrapper.find('div #text').prop('dangerouslySetInnerHTML')).toEqual({
      __html: '<p>Nice text</p>'
    })
  })

  it('does not display the delete menu when deleteComment is not defined', () => {
    const wrapper = shallow(<Comment {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

>>>>>>> dev
  it('displays the delete menu when deleteComment is defined', () => {
    const wrapper = shallow(<Comment {...props} currentUser={{ id: 1 }} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('displays the remove menu when removeComment is defined', () => {
    const wrapper = shallow(<Comment {...props} canModerate />)
    expect(wrapper).toMatchSnapshot()
  })

  it('does not display the remove menu when removeComment is not defined', () => {
    const wrapper = shallow(<Comment {...props} currentUser={{ id: 1 }} canModerate />)
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
      const wrapper = shallow(<Comment {...props} />)
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
      expect(props.updateComment).toHaveBeenCalled()
    })
  })
})
