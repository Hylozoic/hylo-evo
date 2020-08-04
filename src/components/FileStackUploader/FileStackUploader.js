import React from 'react'
import * as PropTypes from 'prop-types'
import ReactFilestack from 'filestack-react'
import { filestackKey, isTest } from 'config'
import { FILESTACK_ACCEPTED_MIME_TYPES } from 'client/filepicker'

export default function FilestackUploader ({
  apiKey,
  actionOptions: providedActionOptions,
  componentDisplayMode,
  onSuccess,
  customRender
}) {
  const actionOptions = {
    accept: FILESTACK_ACCEPTED_MIME_TYPES,
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
  customRender: PropTypes.func
}
