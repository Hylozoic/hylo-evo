import React from 'react'
import { shallow } from 'enzyme'
import AttachmentManager, { ImageManager, ImagePreview, FileManager, FilePreview } from './AttachmentManager'

describe('AttachmentManager', () => {
  const props = {
    prop1: 'foo',
    prop2: 'bar',
    prop3: 'baz'
  }

  it('renders ImageManager when type is image', () => {
    const wrapper = shallow(<AttachmentManager type='image' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders FileManager when type is file', () => {
    const wrapper = shallow(<AttachmentManager type='file' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ImageManager', () => {
  it('matches last snapshot', () => {
    const props = {
      postId: 1,
      addAttachment: () => {},
      removeAttachment: () => {},
      switchAttachments: () => {},
      showAttachments: true,
      pending: true,
      attachments: ['foo.png', 'bar.jpg']
    }
    const wrapper = shallow(<ImageManager.DecoratedComponent {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ImagePreview', () => {
  it('matches last snapshot', () => {
    const props = {
      url: 'foo.zng',
      removeImage: () => {},
      position: 1,
      connectDragSource: i => i,
      connectDragPreview: i => i,
      connectDropTarget: i => i
    }
    const wrapper = shallow(<ImagePreview.DecoratedComponent {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('FileManager', () => {
  it('matches last snapshot', () => {
    const props = {
      postId: 1,
      addAttachment: () => {},
      removeAttachment: () => {},
      showAttachments: true,
      pending: true,
      attachments: ['foo.pdf', 'bar.zip']
    }
    const wrapper = shallow(<FileManager {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('FilePreview', () => {
  it('matches last snapshot', () => {
    const props = {
      url: 'foo.pdf',
      removeImage: () => {},
      position: 1,
      fileSize: '23.3mb'
    }
    const wrapper = shallow(<FilePreview {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
