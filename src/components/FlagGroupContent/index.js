import React from 'react'
import FlagGroupContent from './FlagGroupContent'
import ReactDOM from 'react-dom'
import { rootDomId } from 'client/util'

const FlagGroupContentPortal = function (props) {
  return ReactDOM.createPortal(
    <FlagGroupContent {...props} />,
    document.getElementById(rootDomId)
  )
}

export default FlagGroupContentPortal
