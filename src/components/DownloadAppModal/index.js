import React from 'react'
import ReactDOM from 'react-dom'
import DownloadAppModal from './DownloadAppModal'
import { rootDomId } from 'client/util'

const DownloadAppPortal = function (props) {
  return ReactDOM.createPortal(
    <DownloadAppModal {...props} />,
      document.getElementById(rootDomId)
    )
}

export default DownloadAppPortal
