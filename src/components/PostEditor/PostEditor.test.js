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
      const props = {post: { type }, titlePlaceholderForPostType}
      return shallow(<PostEditor {...props} />)
    }
    ['discussion', 'request', 'offer'].forEach(postType =>
      test(`correct title placeholder and type button selection for "${postType}" type`, () => {
        expect(renderForType(postType)).toMatchSnapshot()
      })
    )
  })

  test('editing a post', () => {
    const props = {
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
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editor = {isEmpty: jest.fn(() => false)}
      expect(testInstance.isValid(props.post, {})).toBeTruthy()
    })

    it('is invalid when values are missing', () => {
      const props = {
        post: {
          title: 'valid title'
        }
      }
      const testInstance = shallow(<PostEditor {...props} />).instance()
      testInstance.editor = {isEmpty: jest.fn(() => false)}
      expect(testInstance.isValid(props.post, {})).toBeFalsy()
    })
  })

  test('onClose is attached to the close button ', () => {
    const props = {
      onClose: jest.fn()
    }
    const wrapper = shallow(<PostEditor {...props} />)
    expect(wrapper.find('[data-styleName="initial-closeButton"]').props().onClick)
      .toEqual(props.onClose)
  })


  // it('sets all fields to disabled when disabled set')
  // it('post button is enabled/disabled if valid/invalid', () => {})
  // expect(validPostProps.createPost.mock.calls).toHaveLength(1)
})

// onClose, initialPrompt, detailsPlaceholder, communityOptions

// expect(wrapper.find('Connect(HyloEditor)').props().contentHTML)
//   .toEqual(editPost.post.details)
// expect(wrapper.find('CommunitiesSelector').props().selected)
//   .toEqual(editPost.post.communities)
// expect(wrapper.find('[data-styleName="postTypes"]').props())
//   .toEqual(editPost.post.details)
