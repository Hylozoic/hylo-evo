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
import './AttachmentManager.scss'

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
        <div styleName='image-manager'>
          {showLabel && <div styleName='section-label'>{t('Images')}</div>}
          <div styleName='image-previews'>
            {images.map((attachment, i) =>
              <ImagePreview
                attachment={attachment}
                removeImage={() => removeAttachment(type, id, attachment)}
                index={i}
                key={i}
              />)}
            {showLoading && uploadAttachmentPending && <div styleName='add-image'><Loading /></div>}
            {showAddButton && (
              <UploadAttachmentButton
                type={type}
                id={id}
                attachmentType='image'
                onSuccess={attachment => addAttachment(type, id, attachment)}>
                <div styleName='add-image'>+</div>
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
    <div styleName='image-preview' ref={setNodeRef} style={style} {...listeners} {...attributes}>
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
  const { t } = useTranslation()

  return (
    <div styleName='file-manager'>
      {showLabel && <div styleName='section-label'>{t('Files')}</div>}
      <div styleName='file-previews'>
        {attachments.map((attachment, i) =>
          <FilePreview
            attachment={attachment}
            removeFile={() => removeAttachment(type, id, attachment)}
            key={i} />)}
        {showLoading && uploadAttachmentPending && <div styleName='loading-file'>{t('Loading...')}</div>}
        {showAddButton && (
          <UploadAttachmentButton
            id={id}
            type={type}
            attachmentType='file'
            onSuccess={attachment => addAttachment(type, id, attachment)}
            styleName='add-file-row'>
            <div styleName='add-file'>
              <span styleName='add-file-plus'>+</span> {t('Add File')}
            </div>
          </UploadAttachmentButton>)}
      </div>
    </div>
  )
}

export function FilePreview ({ attachment, removeFile, fileSize }) {
  const filename = path.basename(attachment.url)
  return (
    <div styleName='file-preview'>
      <Icon name='Document' styleName='icon-document' />
      <div styleName='file-name'>{decodeURIComponent(filename)}</div>
      {fileSize && <div styleName='file-size'>{fileSize}</div>}
      <Icon name='Ex' styleName='remove-file' onClick={removeFile} />
    </div>
  )
}
