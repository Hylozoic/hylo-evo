import CommentForm from './CommentForm'
import { shallow } from 'enzyme'
import React from 'react'
import Me from 'store/models/Me'

jest.mock('react-i18next', () => ({
  ...jest.requireActual('react-i18next'),
  withTranslation: () => Component => {
    Component.defaultProps = { ...Component.defaultProps, t: (str) => str }
    return Component
  }
}))

const minDefaultProps = {
  postId: 'new',
  createComment: () => {},
  currentUser: new Me({
    name: 'Jen Smith',
    avatarUrl: 'foo.png'
  }),
  sendIsTyping: () => {},
  addAttachment: () => {},
  clearAttachments: () => {},
  attachments: []
}

describe('CommentForm', () => {
  it('renders correctly', () => {
    const wrapper = shallow(<CommentForm {...minDefaultProps} />)
    expect(wrapper.find('ForwardRef(HyloEditor)')).toHaveLength(1)
    expect(wrapper.find('ForwardRef(HyloEditor)').prop('placeholder'))
      .toEqual('Add a comment...')
  })
})
