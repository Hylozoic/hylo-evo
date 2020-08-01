import React from 'react'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import path from 'path'
import { isEmpty, pullAt } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'
import './AttachmentManager.scss'

export default class AttachmentManager extends React.Component {
  defaultProps = {
    id: ID_FOR_NEW
  }

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
    const { uploadPending, attachments, attachmentType } = this.props

    if (!(uploadPending || !isEmpty(attachments))) return null

    return <React.Fragment>
      {(!attachmentType || attachmentType === 'image') &&
        <ImageManager {...this.props} />}
      {attachmentType === 'file' &&
        <FileManager {...this.props} />}
    </React.Fragment>
  }
}

export const ImageManager = DragDropContext(HTML5Backend)(
  class ImageManager extends React.Component {
    render () {
      const { id, type, attachments, uploadPending, addAttachment, removeAttachment } = this.props

      return <div styleName='image-manager'>
        <div styleName='section-label'>Images</div>
        <div styleName='image-previews'>
          {attachments.map((attachment, i) =>
            <ImagePreview
              attachment={attachment}
              removeImage={() => removeAttachment(i)}
              switchImages={this.switchAttachments}
              position={i}
              key={i} />)}
          {uploadPending && <div styleName='add-image'><Loading /></div>}
          <UploadAttachmentButton
            type={type}
            id={id}
            attachmentType={'image'}
            onSuccess={addAttachment}>
            <div styleName='add-image'>+</div>
          </UploadAttachmentButton>
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
          attachment, removeImage, connectDragSource, connectDragPreview, connectDropTarget
        } = this.props

        return connectDropTarget(connectDragSource(<div styleName='image-preview'>
          <div style={bgImageStyle(attachment.url)} styleName='image'>
            <Icon name='Ex' styleName='remove-image' onClick={removeImage} />
            {connectDragPreview(<div styleName='drag-preview' />)}
          </div>
        </div>))
      }
    }))

export function FileManager ({
  id, type, showAttachments, attachments, uploadPending, addAttachment, removeAttachment
}) {
  return <div styleName='file-manager'>
    <div styleName='section-label'>Files</div>
    <div styleName='file-previews'>
      {attachments.map((attachment, i) =>
        <FilePreview
          attachment={attachment}
          removeFile={() => removeAttachment(i)}
          key={i} />)}
      {uploadPending && <div styleName='loading-file'>Loading...</div>}
      <UploadAttachmentButton
        id={id}
        type={type}
        attachmentType={'file'}
        onSuccess={addAttachment}
        styleName='add-file-row'>
        <div styleName='add-file'>
          <span styleName='add-file-plus'>+</span> Add File</div>
      </UploadAttachmentButton>
    </div>
  </div>
}

export function FilePreview ({ attachment, removeFile, fileSize }) {
  const name = path.basename(attachment.url)
  return <div styleName='file-preview'>
    <Icon name='Document' styleName='icon-document' />
    <div styleName='file-name'>{decodeURIComponent(name)}</div>
    {fileSize && <div styleName='file-size'>{fileSize}</div>}
    {removeFile && <Icon name='Ex' styleName='remove-file' onClick={removeFile} />}
  </div>
}
