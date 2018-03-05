import React from 'react'
import ModalDialog from './ModalDialog'
import ReactDOM from 'react-dom'
import { rootDomId } from 'client/util'

export default function ModalDialogPortal (props) {
  return ReactDOM.createPortal(
    <ModalDialog {...props}>{props.children}</ModalDialog>,
    document.getElementById(rootDomId)
  )
}
