import React from 'react'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import { bgImageStyle } from 'util/index'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ChangeImageButton from 'components/ChangeImageButton'
import styles from './ImagePreviews.scss'

export const uploadSettings = id => ({
  type: 'post',
  id: id || 'new'
})

const ImagePreviews = DragDropContext(HTML5Backend)(
class ImagePreviews extends React.Component {
  render () {
    const { id, showImagePreviews, imagePreviews, uploadImagePending, addImage, removeImage, switchImages } = this.props
    if (!showImagePreviews) return null

    return <div styleName='image-preview-section'>
      <div styleName='section-label'>Images</div>
      <div styleName='image-previews'>
        {imagePreviews.map((url, i) =>
          <ImagePreview url={url} removeImage={removeImage} switchImages={switchImages} key={i} position={i} />)}
        {uploadImagePending && <div styleName='add-image'><Loading /></div>}
        <ChangeImageButton update={addImage}
          uploadSettings={uploadSettings(id)}>
          <div styleName='add-image'>+</div>
        </ChangeImageButton>
      </div>
    </div>
  }
})

export default ImagePreviews

const imagePreviewSource = {
  beginDrag (props) {
    return {
      position: props.position
    }
  }
}

const imagePreviewTarget = {
  drop (props, monitor, component) {
    const item = monitor.getItem()
    props.switchImages(props.position, item.position)
  }
}

export const ImagePreview = DropTarget('ImagePreview', imagePreviewTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget()
}))(
DragSource('ImagePreview', imagePreviewSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  connectDragPreview: connect.dragPreview(),
  isDragging: monitor.isDragging()
}))(
class ImagePreview extends React.Component {
  render () {
    const {
      url, removeImage, connectDragSource, connectDragPreview, connectDropTarget, position
    } = this.props

    return connectDropTarget(connectDragSource(<div styleName='image-preview'>
      <div style={bgImageStyle(url)} styleName='image'>
        <Icon name='Ex' styleName='remove-button' onClick={() => removeImage(position)} />
        {connectDragPreview(<div styleName='drag-preview' />)}
      </div>
    </div>))
  }
}))
