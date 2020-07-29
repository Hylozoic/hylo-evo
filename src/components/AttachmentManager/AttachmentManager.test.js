import React from 'react'
import { shallow } from 'enzyme'
import AttachmentManager, { ImageManager, ImagePreview, FileManager, FilePreview } from './AttachmentManager'

describe('AttachmentManager', () => {
  const props = {
    prop1: 'foo',
    prop2: 'bar',
    prop3: 'baz'
  }

  it('renders FileManager by default file', () => {
    const wrapper = shallow(<AttachmentManager loadAttachments={jest.fn()} attachmentType='file' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders ImageManager when image is set', () => {
    const wrapper = shallow(<AttachmentManager loadAttachments={jest.fn()} attachmentType='image' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ImageManager', () => {
  it('matches last snapshot', () => {
    const props = {
      id: 1,
      type: 'post',
      showAttachments: true,
      pending: true,
      attachments: ['foo.png', 'bar.jpg'],
      addAttachment: () => {},
      removeAttachment: () => {},
      switchAttachments: () => {}
    }
    const wrapper = shallow(<ImageManager.DecoratedComponent {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ImagePreview', () => {
  it('matches last snapshot', () => {
    const props = {
      url: 'foo.zng',
      position: 1,
      connectDragSource: i => i,
      connectDragPreview: i => i,
      connectDropTarget: i => i,
      removeImage: () => {}
    }
    const wrapper = shallow(<ImagePreview.DecoratedComponent {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('FileManager', () => {
  it('matches last snapshot', () => {
    const props = {
      id: 1,
      type: 'post',
      showAttachments: true,
      pending: true,
      attachments: ['foo.pdf', 'bar.zip'],
      addAttachment: () => {},
      removeAttachment: () => {}
    }
    const wrapper = shallow(<FileManager {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('FilePreview', () => {
  it('matches last snapshot', () => {
    const props = {
      url: 'foo.pdf',
      position: 1,
      fileSize: '23.3mb',
      removeImage: () => {}
    }
    const wrapper = shallow(<FilePreview {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
