import React from 'react'
import Icon from 'components/Icon'
import FilestackUploader from 'components/FilestackUploader'
import './UploadAttachmentButton.scss'
import { addAttachment } from 'components/AttachmentManager/AttachmentManager.store'

export default function UploadAttachmentButton ({
  uploadAttachmentUsingPicker,
  loading,
  className,
  children,
  disable,

  type,
  id,
  onSuccess
}) {
  const iconName = loading ? 'Clock' : 'AddImage'
  const onClick = loading || disable ? () => {} : uploadAttachmentUsingPicker

  if (children) return <div onClick={onClick} className={className}>{children}</div>

  return <FilestackUploader
    type={type}
    id={id}
    onUploadAttachmentSuccess={attachment => onSuccess(type, id, addAttachment)}
  />
  // <div styleName='button' onClick={onClick} className={className}>
  //   <Icon name={iconName} styleName='icon' />
  // </div>
}
