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
        titlePlaceholderForPostType,
        editing: true,
        loading: false
      }
      return shallow(<PostEditor {...props} />)
    }
    ['discussion', 'request', 'offer'].forEach(postType =>
      test(`correct title placeholder and type button selection for "${postType}" type`, () => {
        expect(renderForType(postType)).toMatchSnapshot()
      })
    )

    test('saving a post will update a post', () => {
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
        editing: true,
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

  describe('editing a post', () => {
    test('post is loaded into fields', () => {
      const props = {
        post: {
          type: 'request',
          title: 'valid title',
          details: 'valid details',
          linkPreview: {id: '1', title: 'a link'},
          communities: [
            {id: '1', name: 'test community 1'},
            {id: '2', name: 'test community 2'}
          ]
        },
        editing: true
      }
      const wrapper = shallow(<PostEditor {...props} />)
      expect(wrapper).toMatchSnapshot()
    })

    test('saving a post will update a post', () => {
      const props = {
        editing: true,
        post: {
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

  test('post is defaulted while loaded into editor', () => {
    const props = {
      loading: true,
      editing: true,
      post: {
        type: 'request',
        title: 'valid title',
        details: 'valid details',
        communities: [
          {id: '1', name: 'test community 1'},
          {id: '2', name: 'test community 2'}
        ]
      }
    }
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  test('form in editing mode', () => {
    const props = {
      editing: true,
      post: {
        type: 'request',
        title: 'valid title',
        details: 'valid details',
        communities: [
          {id: '1', name: 'test community 1'},
          {id: '2', name: 'test community 2'}
        ]
      }
    }
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('valid', () => {
    it('is valid when all required values are supplied', () => {
      const props = {
        post: {
          type: 'request',
          title: 'valid title',
          communities: [
            {id: '1', name: 'test community 1'}
          ]
        },
        editing: true
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editor = {isEmpty: jest.fn(() => false)}
      expect(testInstance.isValid(props.post, {})).toBeTruthy()
    })

    it('is invalid when required values are missing', () => {
      const props = {
        post: {
          title: 'valid title'
        },
        editing: true
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
      post: {
        type: 'offer',
        title: 'valid title',
        details: 'valid details',
        linkPreview: {id: '1', title: 'a link'},
        communities: [
          {id: '1', name: 'test community 1'},
          {id: '2', name: 'test community 2'}
        ]
      },
      editing: true,
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
