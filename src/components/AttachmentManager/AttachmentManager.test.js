/* eslint-disable no-unused-expressions */
import React from 'react'
import { shallow } from 'enzyme'
import { render } from 'util/testing/reactTestingLibraryExtended'
import AttachmentManager, { ImageManager, ImagePreview, FileManager, FilePreview } from './AttachmentManager'

const minDefaultProps = {
  type: 'anything',
  loadAttachments: () => {},
  addAttachment: () => {},
  removeAttachment: () => {},
  switchAttachments: () => {},
  clearAttachments: () => {},
  setAttachments: () => {}
}

const postEditorCaseDefaultProps = {
  ...minDefaultProps,
  type: 'post',
  showLabel: true,
  showLoading: true,
  showsAddButton: true
}

const commentFormCaseDefaultProps = {
  ...minDefaultProps,
  type: 'comment'
}

const imageAttachments = [
  { attachmentType: 'image', url: 'https://nowhere/foo.png' },
  { attachmentType: 'image', url: 'https://nowhere/bar.jpg' }
]

const fileAttachments = [
  { attachmentType: 'file', url: 'https://nowhere/thing1.pdf' },
  { attachmentType: 'file', url: 'https://nowhere/thing2.xls' }
]

const attachments = [
  ...imageAttachments,
  ...fileAttachments
]

describe('AttachmentManager', () => {
  it('renders with minProps', () => {
    expect(shallow(
      <AttachmentManager {...minDefaultProps} />
    ).text()).toBe('')
  })

  describe('as used with PostEditor (showLabel, showLoading, showAddButtons)', () => {
    test('when empty', () => {
      expect(shallow(
        <AttachmentManager {...postEditorCaseDefaultProps} />
      )).toMatchSnapshot()
    })

    test('with attachments', () => {
      expect(shallow(
        <AttachmentManager attachments={attachments} {...postEditorCaseDefaultProps} />
      )).toMatchSnapshot()
    })

    test('when loading', () => {
      expect(shallow(
        <AttachmentManager uploadAttachmentPending {...postEditorCaseDefaultProps} />
      )).toMatchSnapshot()
    })

    test('when loading, with attachments', () => {
      expect(shallow(
        <AttachmentManager attachments={attachments} uploadAttachmentPending {...postEditorCaseDefaultProps} />
      )).toMatchSnapshot()
    })
  })

  describe('as used with CommentForm (default case)', () => {
    test('when empty', () => {
      expect(shallow(
        <AttachmentManager {...commentFormCaseDefaultProps} />
      )).toMatchSnapshot()
    })

    test('with attachments', () => {
      expect(shallow(
        <AttachmentManager attachments={attachments} {...commentFormCaseDefaultProps} />
      )).toMatchSnapshot()
    })

    test('when loading', () => {
      expect(shallow(
        <AttachmentManager uploadAttachmentPending {...commentFormCaseDefaultProps} />
      )).toMatchSnapshot()
    })

    test('when loading, with attachments', () => {
      expect(shallow(
        <AttachmentManager attachments={attachments} uploadAttachmentPending {...commentFormCaseDefaultProps} />
      )).toMatchSnapshot()
    })
  })

  describe('when attachmentType', () => {
    describe('"image"', () => {
      test('with attachments (of both types), when loading', () => {
        expect(shallow(
          <AttachmentManager attachmentType='image' attachments={attachments} uploadAttachmentPending {...minDefaultProps} />
        )).toMatchSnapshot()
      })
    })
    describe('"file"', () => {
      test('with attachments (of both types), when loading', () => {
        expect(shallow(
          <AttachmentManager attachmentType='file' attachments={attachments} uploadAttachmentPending {...minDefaultProps} />
        )).toMatchSnapshot()
      })
    })
    describe('not provided', () => {
      test('with attachments (of both types), when loading', () => {
        expect(shallow(
          <AttachmentManager attachments={attachments} uploadAttachmentPending {...minDefaultProps} />
        )).toMatchSnapshot()
      })
    })
  })
})

describe('ImageManager', () => {
  it('matches last snapshot', () => {
    const props = {
      type: 'post',
      id: 1,
      showLabel: true,
      showAddButton: true,
      showLoading: true,
      uploadAttachmentPending: true,
      attachments: imageAttachments,
      addAttachment: () => {},
      removeAttachment: () => {},
      switchAttachments: () => {}
    }
    const wrapper = shallow(<ImageManager {...props} />)
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
      removeImage: () => {}
    }
    const wrapper = render(<ImagePreview {...props} />)
    expect(wrapper).toMatchSnapshot()
  })
})

describe('FileManager', () => {
  it('matches last snapshot', () => {
    const props = {
      type: 'post',
      id: 1,
      showLabel: true,
      showAddButton: true,
      showLoading: true,
      uploadAttachmentPending: true,
      attachments: fileAttachments,
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
