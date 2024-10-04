import React from 'react'
import FlagContent from './FlagContent'
import ReactDOM from 'react-dom'
import { rootDomId } from 'client/util'

const FlagContentPortal = function (props) {
  return ReactDOM.createPortal(
    <FlagContent {...props} />,
    document.getElementById(rootDomId)
  )
}

export default FlagContentPortal
