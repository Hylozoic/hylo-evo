import React from 'react'
import { shallow } from 'enzyme'
import AttachmentManager, { ImageManager, ImagePreview, FileManager, FilePreview } from './AttachmentManager'

describe('AttachmentManager', () => {
  const props = {
    prop1: 'foo',
    prop2: 'bar',
    prop3: 'baz'
  }

  it('renders FileManager when attachmentType is "file"', () => {
    const wrapper = shallow(<AttachmentManager loadAttachments={jest.fn()} attachmentType='file' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders ImageManager when attachmentType is "image"', () => {
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
      attachments: [
        { url: 'https://nowhere/foo.png', type: 'image', id: 'new', filename: 'foo.png' },
        { url: 'https://nowhere/bar.jpg', mimetype: 'image/jpeg', id: 'new', filename: 'bar.jpg' }
      ],
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
      attachment: { url: 'https://nowhere/foo.zng', type: 'file', id: 'new', filename: 'foo.zng' },
      attachments: [
        { url: 'https://nowhere/foo.png', type: 'image', id: 'new', filename: 'foo.png' },
        { url: 'https://nowhere/foo.png', mimetype: 'image/jpeg', id: 'new', filename: 'foo.png' }
      ],


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
      attachments: [
        { url: 'https://nowhere/foo.pdf', type: 'file', id: 'new', filename: 'foo.pdf' },
        { url: 'https://nowhere/bar.zip', mimetype: 'file/somefiletype', id: 'new', filename: 'bar.zip' },
        { url: 'https://nowhere/bar.zip', id: 'new', filename: 'bar.zip' }
      ],
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
      attachment: { url: 'https://nowhere/foo.pdf', type: 'file', id: 'new', filename: 'foo.pdf' },
      position: 1,
      fileSize: '23.3mb',
      removeFile: () => {}
    }
    const wrapper = shallow(<FilePreview {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
