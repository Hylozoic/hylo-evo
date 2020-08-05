import React from 'react'
import { shallow } from 'enzyme'
import AttachmentManager, { ImageManager, ImagePreview, FileManager, FilePreview } from './AttachmentManager'

describe('AttachmentManager', () => {
  const props = {
    uploadAttachmentPending: true,
    attachments: [],
    loadAttachments: () => {},
    removeAttachment: () => {},
    addAttachment: () => {}
  }

  it('renders FileManager when attachmentType is "file"', () => {
    const wrapper = shallow(<AttachmentManager type='comment' attachmentType='file' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders ImageManager when attachmentType is "image"', () => {
    const wrapper = shallow(<AttachmentManager type='post' attachmentType='image' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })

  it('renders ImageManager when an attachmentType is not specificed', () => {
    const wrapper = shallow(<AttachmentManager type='post' {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('ImageManager', () => {
  it('matches last snapshot', () => {
    const props = {
      id: 1,
      type: 'post',
      uploadAttachmentPending: false,
      attachments: [
        { attachmentType: 'image', url: 'https://nowhere/foo.png' },
        { attachmentType: 'image', url: 'https://nowhere/bar.jpg' }
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
      attachment: { url: 'https://nowhere/foo.zng', attachmentType: 'file' },
      attachments: [
        { attachmentType: 'image', url: 'https://nowhere/foo.png' },
        { attachmentType: 'image', url: 'https://nowhere/foo.png' }
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
      uploadAttachmentPending: true,
      attachments: [
        { url: 'https://nowhere/foo.pdf', attachmentType: 'file' },
        { url: 'https://nowhere/bar.zip', attachmentType: 'file' },
        { url: 'https://nowhere/bar.zip', attachmentType: 'file' }
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
      attachment: { url: 'https://nowhere/foo.pdf', attachmentType: 'file' },
      position: 1,
      fileSize: '23.3mb',
      removeFile: () => {}
    }
    const wrapper = shallow(<FilePreview {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})
