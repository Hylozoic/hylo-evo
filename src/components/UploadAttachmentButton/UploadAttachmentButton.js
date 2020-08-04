import React from 'react'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'
import Icon from 'components/Icon'
import FilestackUploader from 'components/FilestackUploader'
import './UploadAttachmentButton.scss'

export default function UploadAttachmentButton ({
  type,
  id = ID_FOR_NEW,
  onSuccess,
  ...rest
}) {
  return <FilestackUploader
    type={type}
    id={id}
    // For addAttachment...
    // onUploadAttachmentSuccess={attachment => onSuccess(type, id, addAttachment)}
    onUploadAttachmentSuccess={onSuccess}
    customRender={props => <UploadButton {...props} {...rest} />}
  />
}

export function UploadButton ({
  onPick,
  loading,
  disable,
  className,
  children
}) {
  const iconName = loading ? 'Clock' : 'AddImage'
  const onClick = loading || disable ? () => {} : onPick

  return <div onClick={onClick} className={className}>
    {children && children}
    {!children && <Icon
      name={iconName}
      styleName={cx('action-icon', { 'highlight-icon': true })}
    />}
  </div>
}
