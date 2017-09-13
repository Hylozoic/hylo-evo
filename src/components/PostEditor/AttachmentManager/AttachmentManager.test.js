import React from 'react'
import { shallow } from 'enzyme'
import AttachmentManager, { ImagePreview } from './AttachmentManager'

describe('AttachmentManager', () => {
  it('matches last snapshot', () => {
    const props = {
      id: 1,
      addImage: () => {},
      removeImage: () => {},
      switchImages: () => {},
      showImagePreviews: true,
      uploadImagePending: true,
      imagePreviews: ['foo.png', 'bar.jpg']
    }
    const wrapper = shallow(<AttachmentManager.DecoratedComponent {...props} />)
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
