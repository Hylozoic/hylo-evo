import React from 'react'
import ReactDOM from 'react-dom'
import SendAnnouncementModal from './SendAnnouncementModal'
import { rootDomId } from 'client/util'

const SendAnnouncementPortal = function (props) {
  return ReactDOM.createPortal(
    <SendAnnouncementModal {...props} />,
    document.getElementById(rootDomId)
  )
}

export default SendAnnouncementPortal
