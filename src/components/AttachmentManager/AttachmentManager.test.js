import React from 'react'
import { shallow } from 'enzyme'
import AttachmentManager, { ImageManager, ImagePreview, FileManager, FilePreview } from './AttachmentManager'

describe('AttachmentManager', () => {
  const props = {
    prop1: 'foo',
    prop2: 'bar',
    prop3: 'baz',
    uploadPending: true
  }

  it('renders FileManager when attachmentType is "file"', () => {
    const wrapper = shallow(<AttachmentManager type='comment' attachmentType='file' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders ImageManager when attachmentType is "image"', () => {
    const wrapper = shallow(<AttachmentManager type='post' attachmentType='image' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ImageManager', () => {
  it('matches last snapshot', () => {
    const props = {
      id: 1,
      type: 'post',
      uploadPending: true,
      attachments: [
        { url: 'https://nowhere/foo.png', attachmentType: 'image', id: 1, filename: 'foo.png' },
        { url: 'https://nowhere/bar.jpg', attachmentType: 'image', id: 1, filename: 'bar.jpg' }
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
        { url: 'https://nowhere/foo.png', attachmentType: 'image', id: 'new', filename: 'foo.png' },
        { url: 'https://nowhere/foo.png', attachmentType: 'image', id: 'new', filename: 'bar.png' }
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
      uploadPending: true,
      attachments: [
        { url: 'https://nowhere/foo.pdf', attachmentType: 'file', id: 1, filename: 'foo.pdf' },
        { url: 'https://nowhere/bar.zip', attachmentType: 'file', id: 1, filename: 'bar.zip' },
        { url: 'https://nowhere/bar.zip', attachmentType: 'file', id: 1, filename: 'bar.zip' }
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
      attachment: { url: 'https://nowhere/foo.pdf', attachmentType: 'file', id: 'new', filename: 'foo.pdf' },
      position: 1,
      fileSize: '23.3mb',
      removeFile: () => {}
    }
    const wrapper = shallow(<FilePreview {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
