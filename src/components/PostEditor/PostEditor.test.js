/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import PostEditor from './PostEditor'

describe('PostEditor', () => {
  it('renders with min props', () => {
    const props = {}
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('for a new post', () => {
    test('initial prompt and placeholders', () => {
      const props = {
        initialPrompt: 'a test prompt',
        titlePlaceholderForPostType: {
          default: 'a test title placeholder'
        },
        detailsPlaceholder: 'details placeholder'
      }
      const wrapper = shallow(<PostEditor {...props} />)
      expect(wrapper).toMatchSnapshot()
    })

    const titlePlaceholderForPostType = {
      discussion: 'discussion placeholder',
      request: 'request placeholder',
      offer: 'offer placeholder',
      default: 'default placeholder'
    }
    const renderForType = (type) => {
      const props = {
        post: { type },
        titlePlaceholderForPostType
      }
      return shallow(<PostEditor {...props} />)
    }
    ['discussion', 'request', 'offer'].forEach(postType =>
      test(`correct title placeholder and type button selection for "${postType}" type`, () => {
        expect(renderForType(postType)).toMatchSnapshot()
      })
    )

    test('saving a post will create a new post', () => {
      const props = {
        post: {
          type: 'offer',
          title: 'valid title',
          details: 'valid details',
          communities: [
            {id: '1', name: 'test community 1'},
            {id: '2', name: 'test community 2'}
          ]
        },
        createPost: jest.fn(() => new Promise(() => {}))
      }
      const editorMock = {
        getContentHTML: () => props.post.details,
        reset: jest.fn()
      }
      const communitiesSelectorMock = {
        reset: jest.fn()
      }
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.editor = editorMock
      testInstance.communitiesSelector = communitiesSelectorMock
      testInstance.save()
      expect(props.createPost.mock.calls).toHaveLength(1)
      expect(props.createPost).toHaveBeenCalledWith(props.post)
    })
  })

  describe('editing a post', () => {
    const props = {
      editing: true,
      post: {
        id: 'test',
        type: 'request',
        title: 'valid title',
        details: 'valid details',
        linkPreview: {id: '1', title: 'a link'},
        communities: [
          {id: '1', name: 'test community 1'},
          {id: '2', name: 'test community 2'}
        ]
      },
      updatePost: jest.fn(() => new Promise(() => {}))
    }

    test('form in editing mode', () => {
      const wrapper = shallow(<PostEditor {...props} />)
      expect(wrapper).toMatchSnapshot()
    })

    test('post is loaded into fields', () => {
      const wrapper = shallow(<PostEditor {...props} />)
      expect(wrapper).toMatchSnapshot()
    })

    test('saving a post will update a post', () => {
      const editorMock = {
        getContentHTML: () => props.post.details,
        reset: jest.fn()
      }
      const communitiesSelectorMock = {
        reset: jest.fn()
      }
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.editor = editorMock
      testInstance.communitiesSelector = communitiesSelectorMock
      testInstance.save()
      expect(props.updatePost.mock.calls).toHaveLength(1)
      expect(props.updatePost).toHaveBeenCalledWith(props.post)
    })
  })

  test('post is defaulted while loaded into editor', () => {
    const props = {
      editing: true,
      loading: true
    }
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('valid', () => {
    it('is valid when all required values are supplied', () => {
      const props = {
        editing: true,
        post: {
          type: 'request',
          title: 'valid title',
          communities: [
            {id: '1', name: 'test community 1'}
          ]
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editor = {isEmpty: jest.fn(() => false)}
      expect(testInstance.isValid(props.post, {})).toBeTruthy()
    })

    it('is invalid when required values are missing', () => {
      const props = {
        editing: true,
        post: {
          title: 'valid title'
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editor = {isEmpty: jest.fn(() => false)}
      expect(testInstance.isValid(props.post, {})).toBeFalsy()
    })
  })

  test('onClose is attached to the close button', () => {
    const props = {
      onClose: jest.fn()
    }
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper.find('[data-styleName="initial-closeButton"]').props().onClick)
      .toEqual(props.onClose)
  })

  test('saving a valid post will update a post', () => {
    const props = {
      editing: true,
      post: {
        id: 'test',
        type: 'offer',
        title: 'valid title',
        details: 'valid details',
        linkPreview: {id: '1', title: 'a link'},
        communities: [
          {id: '1', name: 'test community 1'},
          {id: '2', name: 'test community 2'}
        ]
      },
      updatePost: jest.fn(() => new Promise(() => {}))
    }
    const editorMock = {
      getContentHTML: () => props.post.details,
      reset: jest.fn()
    }
    const communitiesSelectorMock = {
      reset: jest.fn()
    }
    const wrapper = shallow(<PostEditor {...props} />)
    const testInstance = wrapper.instance()
    testInstance.editor = editorMock
    testInstance.communitiesSelector = communitiesSelectorMock
    testInstance.save()
    expect(props.updatePost.mock.calls).toHaveLength(1)
    expect(props.updatePost).toHaveBeenCalledWith(props.post)
  })
})
