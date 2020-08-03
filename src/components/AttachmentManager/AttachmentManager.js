import React from 'react'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import path from 'path'
import { isEmpty, filter } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'
import './AttachmentManager.scss'

export default class AttachmentManager extends React.Component {
  static defaultProps = {
    id: ID_FOR_NEW
  }

  componentDidMount () {
    this.props.loadAttachments()
  }

  componentDidUpdate (prevProps) {
    if (
      isEmpty(prevProps.attachmentsFromObject) &&
      !isEmpty(this.props.attachmentsFromObject)
    ) {
      this.props.loadAttachments()
    }
  }

  componentWillUnmount () {
    this.props.clearAttachments()
  }

  render () {
    const { attachments, attachmentType, uploadPending } = this.props

    if (isEmpty(attachments) && !uploadPending) return null

    const imageAttachments = filter({ attachmentType: 'image' }, attachments)
    const fileAttachments = filter({ attachmentType: 'file' }, attachments)
    const showImages = (!isEmpty(imageAttachments) || uploadPending) &&
      (!attachmentType || attachmentType === 'image')
    const showFiles = (!isEmpty(fileAttachments) || uploadPending) &&
      (!attachmentType || attachmentType === 'file')

    return <React.Fragment>
      {showImages &&
        <ImageManager {...this.props} attachments={imageAttachments} />}
      {showFiles &&
        <FileManager {...this.props} attachments={fileAttachments} />}
    </React.Fragment>
  }
}

export const ImageManager = DragDropContext(HTML5Backend)(
  class ImageManager extends React.Component {
    render () {
      const { type, id, attachments, uploadPending, addAttachment, removeAttachment } = this.props

      return <div styleName='image-manager'>
        <div styleName='section-label'>Images</div>
        <div styleName='image-previews'>
          {attachments.map((attachment, i) =>
            <ImagePreview
              attachment={attachment}
              removeImage={() => removeAttachment(type, id, attachment)}
              switchImages={this.props.switchAttachments}
              position={i}
              key={i} />)}
          {uploadPending && <div styleName='add-image'><Loading /></div>}
          <UploadAttachmentButton
            type={type}
            id={id}
            attachmentType={'image'}
            onSuccess={attachment => addAttachment(type, id, attachment)}>
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
    props.switchImages('image', props.position, item.position)
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
  type, id, attachments, uploadPending, addAttachment, removeAttachment
}) {
  return <div styleName='file-manager'>
    <div styleName='section-label'>Files</div>
    <div styleName='file-previews'>
      {attachments.map((attachment, i) =>
        <FilePreview
          attachment={attachment}
          removeFile={() => removeAttachment(type, id, attachment)}
          key={i} />)}
      {uploadPending && <div styleName='loading-file'>Loading...</div>}
      <UploadAttachmentButton
        id={id}
        type={type}
        attachmentType={'file'}
        onSuccess={attachment => addAttachment(type, id, attachment)}
        styleName='add-file-row'>
        <div styleName='add-file'>
          <span styleName='add-file-plus'>+</span> Add File</div>
      </UploadAttachmentButton>
    </div>
  </div>
}

export function FilePreview ({ attachment, removeFile, fileSize }) {
  const filename = path.basename(attachment.url)
  return <div styleName='file-preview'>
    <Icon name='Document' styleName='icon-document' />
    <div styleName='file-name'>{decodeURIComponent(filename)}</div>
    {fileSize && <div styleName='file-size'>{fileSize}</div>}
    {removeFile && <Icon name='Ex' styleName='remove-file' onClick={removeFile} />}
  </div>
}
