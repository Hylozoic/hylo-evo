import React from 'react'
import PropTypes from 'prop-types'
import { DragDropContext, DragSource, DropTarget } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import path from 'path'
import { isEmpty, filter } from 'lodash/fp'
import { bgImageStyle } from 'util/index'
import Loading from 'components/Loading'
import Icon from 'components/Icon'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import { ID_FOR_NEW } from './AttachmentManager.store'
import './AttachmentManager.scss'

export const attachmentsObjectType = {
  url: PropTypes.string.isRequired,
  attachmentType: PropTypes.string.isRequired
}

export const attachmentsFromObjectType = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  ...attachmentsObjectType
}

export default class AttachmentManager extends React.Component {
  static propTypes = {
    type: PropTypes.string.isRequired,
    id: PropTypes.string,
    attachmentType: PropTypes.string,
    showAddButton: PropTypes.bool,
    showLabel: PropTypes.bool,
    showLoading: PropTypes.bool,
    // provided by connector
    uploadAttachmentPending: PropTypes.bool,
    attachments: PropTypes.arrayOf(PropTypes.shape(attachmentsObjectType)),
    attachmentsFromObject: PropTypes.arrayOf(PropTypes.shape(attachmentsFromObjectType)),
    loadAttachments: PropTypes.func.isRequired,
    addAttachment: PropTypes.func.isRequired,
    removeAttachment: PropTypes.func.isRequired,
    switchAttachments: PropTypes.func.isRequired,
    clearAttachments: PropTypes.func.isRequired,
    // only used by connector
    setAttachments: PropTypes.func.isRequired
  }

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
    const { attachments, attachmentType, uploadAttachmentPending, showLoading } = this.props

    if (isEmpty(attachments) && !uploadAttachmentPending) return null

    const imageAttachments = filter({ attachmentType: 'image' }, attachments)
    const fileAttachments = filter({ attachmentType: 'file' }, attachments)
    const showImages = (!isEmpty(imageAttachments) || (uploadAttachmentPending && showLoading)) &&
      (!attachmentType || attachmentType === 'image')
    const showFiles = (!isEmpty(fileAttachments) || (uploadAttachmentPending && showLoading)) &&
      (!attachmentType || attachmentType === 'file')

    return <React.Fragment>
      {showImages &&
        <ImageManager {...this.props} showLoading={showLoading} attachments={imageAttachments} />}
      {showFiles &&
        <FileManager {...this.props} showLoading={showLoading} attachments={fileAttachments} />}
    </React.Fragment>
  }
}

export const ImageManager = DragDropContext(HTML5Backend)(
  class ImageManager extends React.Component {
    render () {
      const {
        type, id, attachments, addAttachment, removeAttachment,
        uploadAttachmentPending, showLoading, showAddButton, showLabel
      } = this.props

      return <div styleName='image-manager'>
        {showLabel && <div styleName='section-label'>Images</div>}
        <div styleName='image-previews'>
          {attachments.map((attachment, i) =>
            <ImagePreview
              attachment={attachment}
              removeImage={() => removeAttachment(type, id, attachment)}
              switchImages={this.props.switchImages}
              position={i}
              key={i} />)}
          {showLoading && uploadAttachmentPending && <div styleName='add-image'><Loading /></div>}
          {showAddButton && <UploadAttachmentButton
            type={type}
            id={id}
            attachmentType='image'
            onSuccess={attachment => addAttachment(type, id, attachment)}>
            <div styleName='add-image'>+</div>
          </UploadAttachmentButton>}
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
  type, id, attachments, addAttachment, removeAttachment,
  uploadAttachmentPending, showLoading, showAddButton, showLabel
}) {
  return <div styleName='file-manager'>
    {showLabel && <div styleName='section-label'>Files</div>}
    <div styleName='file-previews'>
      {attachments.map((attachment, i) =>
        <FilePreview
          attachment={attachment}
          removeFile={() => removeAttachment(type, id, attachment)}
          key={i} />)}
      {showLoading && uploadAttachmentPending && <div styleName='loading-file'>Loading...</div>}
      {showAddButton && <UploadAttachmentButton
        id={id}
        type={type}
        attachmentType='file'
        onSuccess={attachment => addAttachment(type, id, attachment)}
        styleName='add-file-row'>
        <div styleName='add-file'>
          <span styleName='add-file-plus'>+</span> Add File</div>
      </UploadAttachmentButton>}
    </div>
  </div>
}

export function FilePreview ({ attachment, removeFile, fileSize }) {
  const filename = path.basename(attachment.url)
  return <div styleName='file-preview'>
    <Icon name='Document' styleName='icon-document' />
    <div styleName='file-name'>{decodeURIComponent(filename)}</div>
    {fileSize && <div styleName='file-size'>{fileSize}</div>}
    <Icon name='Ex' styleName='remove-file' onClick={removeFile} />
  </div>
}
