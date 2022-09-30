import { isEmpty, filter } from 'lodash/fp'
import path from 'path'
import PropTypes from 'prop-types'
import React, { useRef } from 'react'
import { useDrag, useDrop } from 'react-dnd'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import { bgImageStyle } from 'util/index'
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

    // TODO: put this in a state variable that can change in real time to update the ordering as you drag
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

export function ImageManager (props) {
  const {
    type, id, attachments, addAttachment, removeAttachment,
    uploadAttachmentPending, showLoading, showAddButton, showLabel
  } = props

  return <div styleName='image-manager'>
    {showLabel && <div styleName='section-label'>Images</div>}
    <div styleName='image-previews'>
      {attachments.map((attachment, i) =>
        <ImagePreview
          attachment={attachment}
          removeImage={() => removeAttachment(type, id, attachment)}
          switchImages={props.switchImages}
          index={i}
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

function ImagePreview (props) {
  const {
    attachment, index, removeImage, switchImages
  } = props

  const ref = useRef(null)

  const [{ handlerId }, drop] = useDrop({  // eslint-disable-line
    accept: 'image',
    collect (monitor) {
      return {
        handlerId: monitor.getHandlerId()
      }
    },
    hover (item, monitor) {
      if (!ref.current) {
        return
      }
      const dragIndex = item.index
      const hoverIndex = index

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return
      }
      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect()
      // Get vertical middle
      const hoverMiddleX =
        (hoverBoundingRect.right - hoverBoundingRect.left) / 2
      // Determine mouse position
      const clientOffset = monitor.getClientOffset()
      // Get pixels to the left
      const hoverClientX = clientOffset.x - hoverBoundingRect.left
      // Only perform the move when the mouse has crossed half of the items width
      // Dragging right
      if (dragIndex < hoverIndex && hoverClientX < hoverMiddleX) {
        return
      }
      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientX > hoverMiddleX) {
        return
      }
      // Time to actually perform the action
      // XXX: movePost(dragIndex, hoverIndex)
      switchImages(dragIndex, hoverIndex)

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      item.index = hoverIndex
    }
  })
  const [{ isDragging }, drag] = useDrag({
    type: 'image',
    item: () => {
      return { id: attachment.id, index }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging()
    })
  })
  const opacity = isDragging ? 0 : 1
  drag(drop(ref))

  return (
    <div styleName='image-preview' ref={ref} style={{ opacity }}>
      <div style={bgImageStyle(attachment.url)} styleName='image'>
        <Icon name='Ex' styleName='remove-image' onClick={removeImage} />
      </div>
    </div>
  )
}

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
