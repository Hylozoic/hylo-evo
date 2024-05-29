/* eslint-env jest */
import React from 'react'
import { shallow } from 'enzyme'
import PostEditor, { MAX_TITLE_LENGTH, ActionsBar } from './PostEditor'

jest.mock('lodash/debounce', () => fn => {
  fn.cancel = jest.fn()
  return fn
})

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

describe('PostEditor', () => {
  const baseProps = {}

  it('renders with min props', () => {
    const wrapper = shallow(<PostEditor {...baseProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders announcement option with admin in props', () => {
    const props = {
      id: 1,
      addImage: () => {},
      showImagePreviews: true,
      valid: true,
      loading: false,
      submitButtonLabel: 'Save',
      canMakeAnnouncement: true,
      save: () => {}
    }
    const wrapper = shallow(<ActionsBar {...props} />)
    expect(wrapper).toMatchSnapshot()
    expect(wrapper.find('span[data-tip="Send Announcement"]')).toHaveLength(1)
  })

  describe('for a new post', () => {
    test('initial prompt and placeholders', () => {
      const props = {
        ...baseProps,
        initialPrompt: 'a test prompt'
      }
      const wrapper = shallow(<PostEditor {...props} />)
      expect(wrapper).toMatchSnapshot()
    })

    const renderForType = (type) => {
      const props = {
        ...baseProps,
        post: {
          type,
          startTime: new Date(1551908483315),
          endTime: new Date(1551908483315),
          groups: []
        }
      }
      return shallow(<PostEditor {...props} />)
    }
    ['discussion', 'request', 'offer', 'resource'].forEach(postType =>
      test(`correct title placeholder and type button selection for "${postType}" type`, () => {
        expect(renderForType(postType)).toMatchSnapshot()
      })
    )

    test('saving a post will create a new post', async () => {
      const props = {
        ...baseProps,
        post: {
          type: 'offer',
          title: 'valid title',
          groups: [
            { id: '1', name: 'test group 1' },
            { id: '2', name: 'test group 2' }
          ],
          topics: [{ name: 'design' }],
          startTime: new Date(1551908483315),
          endTime: new Date(1551908483315)
        },
        createPost: jest.fn(() => new Promise(() => {})),
        fetchLocation: jest.fn().mockReturnValue('8778'),
        setAnnouncement: jest.fn(),
        ensureLocationIdIfCoordinate: async () => {
          return '666'
        }
      }
      const editorMock = {
        getHTML: () => props.post.details,
        reset: jest.fn()
      }
      const groupsSelectorMock = {
        reset: jest.fn()
      }
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.editorRef.current = editorMock
      testInstance.groupsSelectorRef.current = groupsSelectorMock
      await testInstance.save()
      expect(props.createPost.mock.calls).toHaveLength(1)
      expect(props.createPost.mock.calls).toMatchSnapshot()
    })
  })

  describe.skip('for a new event', () => {
    it('renders correctly', () => {
      const props = {
        ...baseProps,
        isEvent: true,
        post: {
          groups: []
        }
      }
      const wrapper = shallow(<PostEditor {...props} />)
      expect(wrapper).toMatchSnapshot()
    })
  })

  describe('editing a post', () => {
    const props = {
      ...baseProps,
      editing: true,
      post: {
        id: 'test',
        type: 'request',
        title: 'valid title',
        linkPreview: { id: '1', title: 'a link' },
        groups: [
          { id: '1', name: 'test group 1' },
          { id: '2', name: 'test group 2' }
        ],
        topics: [{ name: 'design' }],
        startTime: new Date(1551908483315),
        endTime: new Date(1551908483315)
      },
      updatePost: jest.fn(() => new Promise(() => {})),
      showImagePreviews: true,
      ensureLocationIdIfCoordinate: jest.fn().mockResolvedValue('555'),
      setAnnouncement: jest.fn(),
      setIsDirty: jest.fn()
    }

    test('form in editing mode', () => {
      const wrapper = shallow(<PostEditor {...props} />)
      expect(wrapper).toMatchSnapshot()
    })

    test('post is loaded into fields', () => {
      const wrapper = shallow(<PostEditor {...props} />)
      expect(wrapper).toMatchSnapshot()
    })

    test('saving a post will update a post', async () => {
      const editorMock = {
        getHTML: () => props.post.details,
        reset: jest.fn()
      }
      const groupsSelectorMock = {
        reset: jest.fn()
      }
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.editorRef.current = editorMock
      testInstance.groupsSelectorRef.current = groupsSelectorMock
      await testInstance.save()
      expect(props.updatePost.mock.calls).toHaveLength(1)
      expect(props.updatePost.mock.calls).toMatchSnapshot()
    })

    test('tracks dirty state when content changes', () => {
      const setIsDirty = jest.fn()
      const wrapper = shallow(<PostEditor {...props} setIsDirty={setIsDirty} />)
      const titleElement = wrapper.find('input').first()
      titleElement.simulate('change', { target: { value: 'new value' } })
      expect(setIsDirty).toHaveBeenCalled()
    })

    // NB: MAX_TITLE_LENGTH triggers the error (warning) to the user that they hit the max
    test('tests for valid title length', () => {
      const wrapper = shallow(<PostEditor {...props} />)
      const titleElement = wrapper.find('input').first()
      titleElement.simulate('change', { target: { value: 'x'.repeat(MAX_TITLE_LENGTH - 1) } })
      expect(wrapper.state().titleLengthError).toBeFalsy()
    })

    // NB: MAX_TITLE_LENGTH triggers the error (warning) to the user that they hit the max
    test('tests for invalid title length', () => {
      const wrapper = shallow(<PostEditor {...props} />)
      const titleElement = wrapper.find('input').first()
      titleElement.simulate('change', { target: { value: 'x'.repeat(MAX_TITLE_LENGTH) } })
      expect(wrapper.state().titleLengthError).toBeTruthy()
    })
  })

  it('post is defaulted while loading editor', () => {
    const props = {
      ...baseProps,
      editing: true,
      loading: true
    }
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('post is defaulted while loading editor for NEW post', () => {
    const props = {
      ...baseProps,
      editing: false,
      loading: true
    }
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('valid', () => {
    it('is valid when all required values are supplied', () => {
      const props = {
        ...baseProps,
        post: {
          type: 'request',
          title: 'valid title',
          groups: [
            { id: '1', name: 'test group 1' }
          ]
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editorRef.current = { isEmpty: jest.fn(() => false) }
      expect(testInstance.isValid(props.post, {})).toBeTruthy()
    })

    it('is valid when title is max langth', () => {
      const props = {
        ...baseProps,
        post: {
          type: 'request',
          title: 'x'.repeat(MAX_TITLE_LENGTH),
          groups: [
            { id: '1', name: 'test group 1' }
          ]
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editorRef.current = { isEmpty: jest.fn(() => false) }
      expect(testInstance.isValid(props.post, {})).toBeTruthy()
    })
  })

  describe('invalid', () => {
    it('is invalid when title is missing', () => {
      const props = {
        ...baseProps,
        post: {
          type: 'request',
          title: '',
          groups: [
            { id: '1', name: 'test group 1' }
          ]
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editorRef.current = { isEmpty: jest.fn(() => false) }
      expect(testInstance.isValid(props.post, {})).toBeFalsy()
    })

    it('is invalid when groups is missing', () => {
      const props = {
        ...baseProps,
        post: {
          title: 'is a valid title',
          type: 'Request',
          groups: []
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editorRef = { isEmpty: jest.fn(() => false) }
      expect(testInstance.isValid(props.post, {})).toBeFalsy()
    })

    it('is invalid when type is missing', () => {
      const props = {
        ...baseProps,
        post: {
          title: 'is a valid title',
          type: '',
          groups: [
            { id: '1', name: 'test group 1' }
          ]
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editorRef = { isEmpty: jest.fn(() => false) }
      expect(testInstance.isValid(props.post, {})).toBeFalsy()
    })

    it('is invalid when title is too long', () => {
      const props = {
        ...baseProps,
        post: {
          title: 'X'.repeat(MAX_TITLE_LENGTH + 1),
          type: 'Request',
          groups: [
            { id: '1', name: 'test group 1' }
          ]
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editorRef = { isEmpty: jest.fn(() => false) }
      expect(testInstance.isValid(props.post, {})).toBeFalsy()
    })
  })

  test('saving a valid post will update a post', async () => {
    const props = {
      ...baseProps,
      editing: true,
      post: {
        id: 'test',
        type: 'offer',
        title: 'valid title',
        linkPreview: { id: '1', title: 'a link' },
        groups: [
          { id: '1', name: 'test group 1' },
          { id: '2', name: 'test group 2' }
        ],
        topics: [{ name: 'design' }],
        startTime: new Date(1551908483315),
        endTime: new Date(1551908483315)
      },
      updatePost: jest.fn(() => new Promise(() => {})),
      setAnnouncement: jest.fn(),
      ensureLocationIdIfCoordinate: jest.fn().mockResolvedValue('555')
    }
    const editorMock = {
      getHTML: () => props.post.details,
      reset: jest.fn()
    }
    const groupsSelectorMock = {
      reset: jest.fn()
    }
    const wrapper = shallow(<PostEditor {...props} />)
    const testInstance = wrapper.instance()
    testInstance.editorRef.current = editorMock
    testInstance.groupsSelectorRef.current = groupsSelectorMock
    await testInstance.save()
    expect(props.updatePost.mock.calls).toHaveLength(1)
    expect(props.updatePost.mock.calls).toMatchSnapshot()
  })

  it('renders contribution button', () => {
    const props = {
      ...baseProps,
      isProject: true,
      currentUser: {
        hasStripeAccount: true,
        hasFeature: () => true
      }
    }
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ActionsBar', () => {
  it('matches last snapshot', () => {
    const props = {
      id: 1,
      addImage: () => {},
      showImagePreviews: true,
      valid: true,
      loading: false,
      submitButtonLabel: 'Save',
      save: () => {}
    }
    const wrapper = shallow(<ActionsBar {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('matches last snapshot while loading', () => {
    const props = {
      id: 1,
      addImage: () => {},
      showImagePreviews: true,
      valid: true,
      loading: true,
      submitButtonLabel: 'Posting...',
      save: () => {}
    }
    const wrapper = shallow(<ActionsBar {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
