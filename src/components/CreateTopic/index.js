import React from 'react'
import CreateTopic from './CreateTopic'
import ReactDOM from 'react-dom'
import connector from './CreateTopic.connector'
import { rootDomId } from 'client/util'

function CreateTopicPortal (props) {
  return ReactDOM.createPortal(
    <CreateTopic {...props} />,
    document.getElementById(rootDomId)
  )
}

export default connector(CreateTopicPortal)
