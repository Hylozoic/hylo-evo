/* eslint-env jest */
import React from 'react'
import { merge } from 'lodash'
import { shallow } from 'enzyme'
import PostEditor, { ActionsBar } from './PostEditor'

describe('PostEditor', () => {
  let baseProps = {
    fetchDefaultTopics: jest.fn()
  }

  beforeEach(() => {
    baseProps = {
      fetchDefaultTopics: jest.fn()
    }
  })

  it('renders with min props', () => {
    const wrapper = shallow(<PostEditor {...baseProps} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders announcement option with admin in props', () => {
    const props = {
      ...baseProps,
      canModerate: true
    }
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  describe('for a new post', () => {
    test('initial prompt and placeholders', () => {
      const props = {
        ...baseProps,
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
      resource: 'resource placeholder',
      default: 'default placeholder'
    }
    const renderForType = (type) => {
      const props = {
        ...baseProps,
        post: {
          type,
          startTime: new Date(1551908483315),
          endTime: new Date(1551908483315),
          groups: []
        },
        titlePlaceholderForPostType
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
          topicNames: ['design'],
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
        getContentHTML: () => props.post.details,
        reset: jest.fn()
      }
      const topicSelectorMock = {
        getSelected: () => [{ id: 1, name: 'design' }]
      }
      const groupsSelectorMock = {
        reset: jest.fn()
      }
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.editor.current = editorMock
      testInstance.topicSelector.current = topicSelectorMock
      testInstance.groupsSelector.current = groupsSelectorMock
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
        topicNames: ['design'],
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
        getContentHTML: () => props.post.details,
        reset: jest.fn()
      }
      const topicSelectorMock = {
        getSelected: () => [{ id: 1, name: 'design' }]
      }
      const groupsSelectorMock = {
        reset: jest.fn()
      }
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.editor.current = editorMock
      testInstance.topicSelector.current = topicSelectorMock
      testInstance.groupsSelector.current = groupsSelectorMock
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
      testInstance.editor.current = { isEmpty: jest.fn(() => false) }
      expect(testInstance.isValid(props.post, {})).toBeTruthy()
    })

    it('is invalid when required values are missing', () => {
      const props = {
        ...baseProps,
        post: {
          title: 'valid title',
          groups: [],
          type: 'Request'
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editor = { isEmpty: jest.fn(() => false) }
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
        topicNames: ['design'],
        startTime: new Date(1551908483315),
        endTime: new Date(1551908483315)
      },
      updatePost: jest.fn(() => new Promise(() => {})),
      setAnnouncement: jest.fn(),
      ensureLocationIdIfCoordinate: jest.fn().mockResolvedValue('555')
    }
    const editorMock = {
      getContentHTML: () => props.post.details,
      reset: jest.fn()
    }
    const topicSelectorMock = {
      getSelected: () => [{ id: 1, name: 'design' }]
    }
    const groupsSelectorMock = {
      reset: jest.fn()
    }
    const wrapper = shallow(<PostEditor {...props} />)
    const testInstance = wrapper.instance()
    testInstance.editor.current = editorMock
    testInstance.topicSelector.current = topicSelectorMock
    testInstance.groupsSelector.current = groupsSelectorMock
    await testInstance.save()
    expect(props.updatePost.mock.calls).toHaveLength(1)
    expect(props.updatePost.mock.calls).toMatchSnapshot()
  })

  describe('linkPreview handling', () => {
    let linkPreviewProps, contentStateMock
    beforeEach(() => {
      linkPreviewProps = {
        ...baseProps,
        post: { groups: [] },
        pollingFetchLinkPreview: jest.fn(),
        clearLinkPreview: jest.fn()
      }
      contentStateMock = {
        getBlockMap: () => ([]),
        hasText: () => true
      }
    })

    it('should fetch for a linkPreview', () => {
      const props = linkPreviewProps
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.setLinkPreview(contentStateMock)
      expect(props.pollingFetchLinkPreview.mock.calls).toHaveLength(1)
    })

    it('should not fetch for linkPreview when a post.linkPreview is present', () => {
      const props = merge(linkPreviewProps, {
        post: {
          linkPreview: {},
          groups: []
        }
      })
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.setLinkPreview(contentStateMock)
      expect(props.pollingFetchLinkPreview.mock.calls).toHaveLength(0)
    })

    it('should not fetch for linkPreview when linkStatus is "removed"', () => {
      const props = merge(linkPreviewProps, {
        linkPreviewStatus: 'removed'
      })
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.setLinkPreview(contentStateMock)
      expect(props.pollingFetchLinkPreview.mock.calls).toHaveLength(0)
    })

    it('should not fetch for linkPreview when linkStatus is "invalid"', () => {
      const props = merge(linkPreviewProps, {
        linkPreviewStatus: 'invalid'
      })
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.setLinkPreview(contentStateMock)
      expect(props.pollingFetchLinkPreview.mock.calls).toHaveLength(0)
    })

    it('should reset linkPreview when there is no text and any linkStatus is present', () => {
      contentStateMock = {
        hasText: () => false
      }
      const props = merge(linkPreviewProps, {
        linkPreviewStatus: 'any'
      })
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.setLinkPreview(contentStateMock)
      expect(props.pollingFetchLinkPreview.mock.calls).toHaveLength(0)
      expect(props.clearLinkPreview.mock.calls).toHaveLength(1)
    })

    it('should not reset linkPreview when there is no text but there is a linkPreview present', () => {
      contentStateMock = {
        hasText: () => false
      }
      const props = merge(linkPreviewProps, {
        linkPreviewStatus: null,
        post: {
          linkPreview: {}
        }
      })
      const wrapper = shallow(<PostEditor {...props} />)
      const testInstance = wrapper.instance()
      testInstance.setLinkPreview(contentStateMock)
      expect(props.pollingFetchLinkPreview.mock.calls).toHaveLength(0)
      expect(props.clearLinkPreview.mock.calls).toHaveLength(0)
    })
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
