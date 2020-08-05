import React from 'react'
import * as PropTypes from 'prop-types'
import ReactFilestack from 'filestack-react'
import { filestackKey, isTest } from 'config'
import {
  FILESTACK_ACCEPTED_MIME_TYPES,
  FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE
} from 'client/filestack'

export default function FilestackUploader ({
  apiKey,
  actionOptions: providedActionOptions,
  componentDisplayMode,
  onSuccess,
  customRender,
  attachmentType
}) {
  const actionOptions = {
    accept: attachmentType
      ? FILESTACK_ACCEPTED_MIME_TYPES_BY_ATTACHMENT_TYPE[attachmentType]
      : FILESTACK_ACCEPTED_MIME_TYPES,
    maxFiles: 10,
    ...providedActionOptions
  }

  return <ReactFilestack
    apikey={apiKey}
    actionOptions={actionOptions}
    componentDisplayMode={componentDisplayMode}
    onSuccess={onSuccess}
    customRender={customRender}
  />
}

FilestackUploader.defaultProps = {
  apiKey: isTest ? 'dummykey' : filestackKey,
  componentDisplayMode: {},
  actionOptions: {}
}

FilestackUploader.propTypes = {
  apiKey: PropTypes.string.isRequired,
  actionOptions: PropTypes.object.isRequired,
  componentDisplayMode: PropTypes.object.isRequired,
  onSuccess: PropTypes.func,
  customRender: PropTypes.func,
  imagesOnly: PropTypes.bool
}
