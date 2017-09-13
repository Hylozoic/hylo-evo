import React from 'react'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import { bgImageStyle } from 'util/index'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import ChangeImageButton from 'components/ChangeImageButton'
import './AttachmentManager.scss'

export const uploadSettings = id => ({
  type: 'post',
  id: id || 'new'
})

export default class AttachmentManager extends React.Component {
  componentDidMount () {
    this.props.loadAttachments()
  }

  componentWillReceiveProps (nextProps) {
    if (this.props.postId !== nextProps.postId) {
      this.props.loadAttachments()
    }
  }

  componentWillUnmount () {
    this.props.clearAttachments()
  }

  render () {
    if (this.props.type === 'image') {
      return <ImageManager {...this.props} />
    } else if (this.props.type === 'file') {
      return <FileManager {...this.props} />
    }
  }
}

const ImageManager = DragDropContext(HTML5Backend)(
class ImageManager extends React.Component {
  render () {
    const { postId, showAttachments, attachments, uploadImagePending, addAttachment, removeAttachment, switchAttachments } = this.props
    if (!showAttachments) return null

    return <div styleName='image-manager'>
      <div styleName='section-label'>Images</div>
      <div styleName='image-previews'>
        {attachments.map((url, i) =>
          <ImagePreview url={url}
            removeImage={removeAttachment}
            switchImages={switchAttachments}
            position={i}
            key={i} />)}
        {uploadImagePending && <div styleName='add-image'><Loading /></div>}
        <ChangeImageButton update={addAttachment}
          uploadSettings={uploadSettings(postId)}>
          <div styleName='add-image'>+</div>
        </ChangeImageButton>
      </div>
    </div>
  }
})

export function FileManager ({
  postId, showAttachments, attachments, uploadImagePending, addAttachment, removeAttachment
}) {
  return <div styleName='file-manager'>
    <div styleName='section-label'>Images</div>
    <div styleName='file-previews'>
      {attachments.map((url, i) =>
        <ImagePreview url={url}
          removeFile={removeAttachment}
          position={i}
          key={i} />)}
      {uploadImagePending && <div styleName='add-file'><Loading /></div>}
      <ChangeImageButton update={addAttachment}
        uploadSettings={uploadSettings(postId)}>
        <div styleName='add-file'>+</div>
      </ChangeImageButton>
    </div>
  </div>
}

export function FilePreview ({ url, position, removeAttachment }) {
  const name = path.basename(url)
  return <div styleName='file-preview'>
    
  </div>
}

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
