import React from 'react'
import PropTypes from 'prop-types'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'
import FilestackUploader from 'components/FilestackUploader'
import Icon from 'components/Icon'
import cx from 'classnames'
import './UploadAttachmentButton.scss'

export function UploadButton ({
  onClick,
  loading,
  disable,
  className,
  children
}) {
  const iconName = loading ? 'Clock' : 'AddImage'
  const loadingOnClick = loading || disable ? () => {} : onClick

  return <div onClick={loadingOnClick} className={className}>
    {children && children}
    {!children && <Icon
      name={iconName}
      styleName={cx('action-icon', { 'highlight-icon': true })}
    />}
  </div>
}
export default function UploadAttachmentButton ({
  type,
  id,
  uploadAttachment,
  onSuccess,
  onError,
  // useFilestackLibrary only props
  useFilestackLibrary,
  uploadAttachmentUsingFilestackLibrary,
  attachmentType,
  ...uploadButtonProps
}) {
  const filePickerUploadComplete = response => {
    if (!response) {
      return onError(new Error('No response returned from uploader'))
    }
    if (response.error) return onError(response.error)
    if (response.payload) return onSuccess(response.payload)
  }

  if (useFilestackLibrary) {
    const onClick = () => {
      return uploadAttachmentUsingFilestackLibrary(type, id, attachmentType)
        .then(filePickerUploadComplete)
    }

    return <UploadButton {...uploadButtonProps} onClick={onClick} />
  }

  const fileStackUploaderOnSuccess = ({ filesUploaded }) => {
    return filesUploaded.forEach(attachment =>
      uploadAttachment(type, id, attachment)
        .then(filePickerUploadComplete)
    )
  }

  return <FilestackUploader
    type={type}
    id={id}
    onSuccess={fileStackUploaderOnSuccess}
    customRender={({ onPick }) =>
      <UploadButton onClick={onPick} {...uploadButtonProps} />
    }
  />
}

UploadAttachmentButton.defaultProps = {
  id: ID_FOR_NEW,
  onError: () => {}
}

UploadAttachmentButton.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  uploadAttachment: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  // useFilestackLibrary only props
  useFilestackLibrary: PropTypes.bool,
  uploadAttachmentUsingFilestackLibrary: PropTypes.func,
  attachmentType: PropTypes.string
}
