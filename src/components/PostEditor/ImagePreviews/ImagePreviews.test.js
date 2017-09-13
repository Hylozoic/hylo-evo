import React from 'react'
import { shallow } from 'enzyme'
import ImagePreviews, { ImagePreview } from './ImagePreviews'

describe('ImagePreviews', () => {
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
    const wrapper = shallow(<ImagePreviews.DecoratedComponent {...props} />)
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
