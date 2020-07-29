import React from 'react'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import path from 'path'
import { isEmpty } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import ChangeImageButton from 'components/ChangeImageButton'
import './AttachmentManager.scss'

export default class AttachmentManager extends React.Component {
  componentDidMount () {
    this.props.loadAttachments()
  }

  componentDidUpdate (prevProps) {
    if (isEmpty(prevProps.attachmentsFromObject) && !isEmpty(this.props.attachmentsFromObject)) {
      this.props.loadAttachments()
    }
  }

  componentWillUnmount () {
    this.props.clearAttachments()
  }

  render () {
    if (this.props.attachmentType === 'image') {
      return <ImageManager {...this.props} />
    } else {
      return <FileManager {...this.props} />
    }
  }
}

// AttachmentManager.defaultProps = {
//   id: 'new'
// }

export const ImageManager = DragDropContext(HTML5Backend)(
  class ImageManager extends React.Component {
    render () {
      const { id, type, attachmentType, showAttachments, attachments, pending, addAttachment, removeAttachment, switchAttachments } = this.props
      if (!showAttachments) return null

      return <div styleName='image-manager'>
        <div styleName='section-label'>Images</div>
        <div styleName='image-previews'>
          {attachments.map((url, i) =>
            <ImagePreview
              url={url}
              removeImage={removeAttachment}
              switchImages={switchAttachments}
              position={i}
              key={i} />)}
          {pending && <div styleName='add-image'><Loading /></div>}
          <ChangeImageButton
            id={id}
            type={type}
            attachmentType={attachmentType}
            update={addAttachment}>
            <div styleName='add-image'>+</div>
          </ChangeImageButton>
        </div>
      </div>
    }
  }
)

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
            <Icon name='Ex' styleName='remove-image' onClick={() => removeImage(position)} />
            {connectDragPreview(<div styleName='drag-preview' />)}
          </div>
        </div>))
      }
    }))

export function FileManager ({
  id, type, attachmentType, showAttachments, attachments, pending, addAttachment, removeAttachment
}) {
  if (!showAttachments) return null

  return <div styleName='file-manager'>
    <div styleName='section-label'>Files</div>
    <div styleName='file-previews'>
      {attachments.map((url, i) =>
        <FilePreview
          url={url}
          removeFile={removeAttachment}
          position={i}
          key={i} />)}
      {pending && <div styleName='loading-file'>Loading...</div>}
      <ChangeImageButton
        id={id}
        type={type}
        attachmentType={attachmentType}
        update={addAttachment}
        styleName='add-file-row'>
        <div styleName='add-file'>
          <span styleName='add-file-plus'>+</span> Add File</div>
      </ChangeImageButton>
    </div>
  </div>
}

export function FilePreview ({ url, position, removeFile, fileSize }) {
  const name = path.basename(url)
  return <div styleName='file-preview'>
    <Icon name='Document' styleName='icon-document' />
    <div styleName='file-name'>{decodeURIComponent(name)}</div>
    {fileSize && <div styleName='file-size'>{fileSize}</div>}
    <Icon name='Ex' styleName='remove-file' onClick={() => removeFile(position)} />
  </div>
}
