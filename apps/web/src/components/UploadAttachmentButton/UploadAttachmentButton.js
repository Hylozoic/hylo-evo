import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useTranslation } from 'react-i18next'
import { ID_FOR_NEW } from 'components/AttachmentManager/AttachmentManager.store'
import Icon from 'components/Icon'
import cx from 'classnames'
import './UploadAttachmentButton.scss'
import {
  uploadedFileToAttachment,
  filestackPicker
} from 'client/filestack'

export default function UploadAttachmentButton ({
  type,
  id,
  attachmentType,
  onSuccess,
  onError,
  customRender,
  allowMultiple,
  disable,
  // provided by connector
  uploadAttachment,
  // passed to customRender
  ...uploadButtonProps
}) {
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation()

  const uploadAttachmentComplete = response => {
    if (!response) {
      return onError(new Error('No response returned from uploader'))
    }
    if (response.error) return onError(response.error)
    if (response.payload) return onSuccess(response.payload)
  }

  // Filestack callbacks

  const onFileUploadFinished = async fileUploaded => {
    const attachment = uploadedFileToAttachment({ ...fileUploaded, attachmentType })
    const uploadedAttachment = await uploadAttachment(type, id, attachment)
    return uploadAttachmentComplete(uploadedAttachment)
  }

  const onUploadDone = async ({ filesUploaded }) => {
    await Promise.all(
      filesUploaded.map(filestackFileObject =>
        onFileUploadFinished(filestackFileObject))
    )
    setLoading(false)
  }

  const onCancel = () => setLoading(false)

  const onClick = () => {
    setLoading(true)
    filestackPicker({
      attachmentType,
      maxFiles: allowMultiple ? 10 : 1,
      onUploadDone,
      onCancel,
      t
    }).open()
  }

  const renderProps = {
    onClick: disable || loading
      ? () => {}
      : onClick,
    disable,
    loading,
    ...uploadButtonProps
  }

  if (customRender) return customRender(renderProps)

  return <UploadButton {...renderProps} />
}

UploadAttachmentButton.defaultProps = {
  id: ID_FOR_NEW,
  maxFiles: 1,
  onError: () => {}
}

UploadAttachmentButton.propTypes = {
  type: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  attachmentType: PropTypes.string, // for useFilestackLibrary
  onSuccess: PropTypes.func.isRequired,
  onError: PropTypes.func.isRequired,
  customRender: PropTypes.func,
  allowMultiple: PropTypes.bool,
  disable: PropTypes.bool,
  // provided by connector
  loading: PropTypes.bool,
  uploadAttachment: PropTypes.func.isRequired
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
