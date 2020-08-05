import React from 'react'
import PropTypes from 'prop-types'
import { ID_FOR_NEW } from 'store/actions/uploadAttachment'
import FilestackUploader from 'components/FilestackUploader'
import Icon from 'components/Icon'
import cx from 'classnames'
import './UploadAttachmentButton.scss'

export default function UploadAttachmentButton ({
  type,
  id,
  attachmentType, // for useFilestackLibrary
  uploadAttachment,
  onSuccess,
  onError,
  customRender,
  imagesOnly,
  disable,
  useFilestackLibrary, // for useFilestackLibrary
  // provided by connector
  loading,
  uploadAttachmentUsingFilestackLibrary, // for useFilestackLibrary
  // passed to
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

  const fileStackCustomRender = ({ onPick }) => {
    const renderProps = {
      onClick: disable || loading
        ? () => {}
        : onPick,
      loading,
      disable,
      ...uploadButtonProps
    }

    if (customRender) return customRender(renderProps)

    return <UploadButton {...renderProps} />
  }

  return <FilestackUploader
    type={type}
    id={id}
    attachmentType={attachmentType}
    onSuccess={fileStackUploaderOnSuccess}
    customRender={fileStackCustomRender}
  />
}

UploadAttachmentButton.defaultProps = {
  id: ID_FOR_NEW,
  onError: () => {}
}

UploadAttachmentButton.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  attachmentType: PropTypes.string, // for useFilestackLibrary
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  customRender: PropTypes.func,
  imagesOnly: PropTypes.bool,
  disable: PropTypes.bool,
  useFilestackLibrary: PropTypes.bool, // for useFilestackLibrary
  // provided by connector
  loading: PropTypes.bool,
  uploadAttachment: PropTypes.func.isRequired,
  uploadAttachmentUsingFilestackLibrary: PropTypes.func // for useFilestackLibrary
}

export function UploadButton ({
  onClick,
  loading,
  className,
  iconName = 'AddImage',
  children
}) {
  const loadingIconName = loading ? 'Clock' : iconName

  return <div onClick={onClick} className={className}>
    {children && children}
    {!children && <Icon name={loadingIconName} styleName={cx('icon')} />}
  </div>
}
