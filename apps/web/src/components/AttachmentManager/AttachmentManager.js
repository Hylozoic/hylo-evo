import { isEmpty, filter } from 'lodash/fp'
import path from 'path'
import PropTypes from 'prop-types'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { DndContext } from '@dnd-kit/core'
import { SortableContext, horizontalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import Icon from 'components/Icon'
import Loading from 'components/Loading'
import UploadAttachmentButton from 'components/UploadAttachmentButton'
import { bgImageStyle } from 'util/index'
import { ID_FOR_NEW } from './AttachmentManager.store'
import classes from './AttachmentManager.module.scss'

export const attachmentsObjectType = {
  id: PropTypes.string,
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
    moveAttachment: PropTypes.func.isRequired,
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

    return (
      <>
        {showImages &&
          <ImageManager {...this.props} showLoading={showLoading} attachments={imageAttachments} />}
        {showFiles &&
          <FileManager {...this.props} showLoading={showLoading} attachments={fileAttachments} />}
      </>
    )
  }
}

export function ImageManager (props) {
  const { t } = useTranslation()
  const {
    type, id, attachments, addAttachment, removeAttachment,
    uploadAttachmentPending, showLoading, showAddButton, showLabel
  } = props

  const handleDragEnd = ({ active, over }) => {
    if (active.id !== over.id) {
      props.switchImages(active.data.current.sortable.index, over.data.current.sortable.index)
    }
  }

  const images = attachments.map((attachment, i) => ({
    ...attachment,
    id: attachment.url
  }))

  return (
    <DndContext onDragEnd={handleDragEnd}>
      <SortableContext items={images} strategy={horizontalListSortingStrategy}>
        <div className={classes.imageManager}>
          {showLabel && <div className={classes.sectionLabel}>{t('Images')}</div>}
          <div className={classes.imagePreviews}>
            {images.map((attachment, i) =>
              <ImagePreview
                attachment={attachment}
                removeImage={() => removeAttachment(type, id, attachment)}
                index={i}
                key={i}
              />)}
            {showLoading && uploadAttachmentPending && <div className={classes.addImage}><Loading /></div>}
            {showAddButton && (
              <UploadAttachmentButton
                type={type}
                id={id}
                attachmentType='image'
                onSuccess={attachment => addAttachment(type, id, attachment)}>
                <div className={classes.addImage}>+</div>
              </UploadAttachmentButton>)}
          </div>
        </div>
      </SortableContext>
    </DndContext>
  )
}

export function ImagePreview (props) {
  const {
    attachment, removeImage
  } = props

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({
    id: attachment.id,
    transition: null
    // transition: null,{
    //   duration: 150, // milliseconds
    //   easing: 'cubic-bezier(0.25, 1, 0.5, 1)'
    // }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  return (
    <div className={classes.imagePreview} ref={setNodeRef} style={style}>
      <Icon name='Ex' className={classes.removeImage} onClick={removeImage} />
      <div style={bgImageStyle(attachment.url)} className={classes.image} {...listeners} {...attributes} />
    </div>
  )
}

export function FileManager ({
  type, id, attachments, addAttachment, removeAttachment,
  uploadAttachmentPending, showLoading, showAddButton, showLabel
}) {
  const { t } = useTranslation()

  return (
    <div className={classes.fileManager}>
      {showLabel && <div className={classes.sectionLabel}>{t('Files')}</div>}
      <div className={classes.filePreviews}>
        {attachments.map((attachment, i) =>
          <FilePreview
            attachment={attachment}
            removeFile={() => removeAttachment(type, id, attachment)}
            key={i} />)}
        {showLoading && uploadAttachmentPending && <div className={classes.loadingFile}>{t('Loading...')}</div>}
        {showAddButton && (
          <UploadAttachmentButton
            id={id}
            type={type}
            attachmentType='file'
            onSuccess={attachment => addAttachment(type, id, attachment)}
            className={classes.addFileRow}>
            <div className={classes.addFile}>
              <span className={classes.addFilePlus}>+</span> {t('Add File')}
            </div>
          </UploadAttachmentButton>)}
      </div>
    </div>
  )
}

export function FilePreview ({ attachment, removeFile, fileSize }) {
  const filename = path.basename(attachment.url)
  return (
    <div className={classes.filePreview}>
      <Icon name='Document' className={classes.iconDocument} />
      <div className={classes.fileName}>{decodeURIComponent(filename)}</div>
      {fileSize && <div className={classes.fileSize}>{fileSize}</div>}
      <Icon name='Ex' className={classes.removeFile} onClick={removeFile} />
    </div>
  )
}
