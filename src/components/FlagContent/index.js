import React from 'react'
import FlagContent from './FlagContent'
import ReactDOM from 'react-dom'
import connector from './FlagContent.connector'

const FlagContentPortal = function (props) {
  return ReactDOM.createPortal(
    <FlagContent {...props} />,
    document.getElementById('root')
  )
}

export default connector(FlagContentPortal)
