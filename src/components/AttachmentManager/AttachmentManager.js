import React, { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useDrag, useDrop } from 'react-dnd'
import { isEmpty, filter } from 'lodash/fp'
import path from 'path'
import PropTypes from 'prop-types'
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

const AttachmentManager = (props) => {
  useEffect(() => {
    props.loadAttachments()
    // return () => props.clearAttachments()
  }, [])
  // useEffect(() => {
  //   props.loadAttachments()
  // }, [props.attachmentsFromObject])

  const { attachments, attachmentType, uploadAttachmentPending, showLoading } = props

  if (isEmpty(attachments) && !uploadAttachmentPending) return null

  // TODO: put this in a state variable that can change in real time to update the ordering as you drag
  const imageAttachments = filter({ attachmentType: 'image' }, attachments)
  const fileAttachments = filter({ attachmentType: 'file' }, attachments)
  const showImages = (!isEmpty(imageAttachments) || (uploadAttachmentPending && showLoading)) &&
      (!attachmentType || attachmentType === 'image')
  const showFiles = (!isEmpty(fileAttachments) || (uploadAttachmentPending && showLoading)) &&
      (!attachmentType || attachmentType === 'file')

  return <>
    {showImages &&
    <ImageManager {...props} showLoading={showLoading} attachments={imageAttachments} />}
    {showFiles &&
    <FileManager {...props} showLoading={showLoading} attachments={fileAttachments} />}
  </>
}

AttachmentManager.propTypes = {
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

AttachmentManager.defaultProps = {
  id: ID_FOR_NEW
}

export const ImageManager = (props) => {
  const {
    type, id, attachments, addAttachment, removeAttachment,
    uploadAttachmentPending, showLoading, showAddButton, showLabel
  } = props
  const { t } = useTranslation()

  return <div styleName='image-manager'>
    {showLabel && <div styleName='section-label'>{t('AttachmentManager.imagesTitle')}</div>}
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

export const ImagePreview = (props) => {
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

export const FileManager = ({
  type, id, attachments, addAttachment, removeAttachment,
  uploadAttachmentPending, showLoading, showAddButton, showLabel
}) => {
  const { t } = useTranslation()
  return <div styleName='file-manager'>
    {showLabel && <div styleName='section-label'>{t('AttachmentManager.files')}</div>}
    <div styleName='file-previews'>
      {attachments.map((attachment, i) =>
        <FilePreview
          attachment={attachment}
          removeFile={() => removeAttachment(type, id, attachment)}
          key={i} />)}
      {showLoading && uploadAttachmentPending && <div styleName='loading-file'>{t('AttachmentManager.loadingFile')}</div>}
      {showAddButton && <UploadAttachmentButton
        id={id}
        type={type}
        attachmentType='file'
        onSuccess={attachment => addAttachment(type, id, attachment)}
        styleName='add-file-row'>
        <div styleName='add-file'>
          <span styleName='add-file-plus'>+</span> {t('AttachmentManager.addFile')}</div>
      </UploadAttachmentButton>}
    </div>
  </div>
}

export const FilePreview = ({ attachment, removeFile, fileSize }) => {
  const filename = path.basename(attachment.url)
  return <div styleName='file-preview'>
    <Icon name='Document' styleName='icon-document' />
    <div styleName='file-name'>{decodeURIComponent(filename)}</div>
    {fileSize && <div styleName='file-size'>{fileSize}</div>}
    <Icon name='Ex' styleName='remove-file' onClick={removeFile} />
  </div>
}

export default AttachmentManager
