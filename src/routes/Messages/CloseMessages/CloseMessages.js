import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import './CloseMessages.scss'

function CloseMessages ({ onCloseURL, className }) {
  return <Link to={onCloseURL} styleName='close-messages' className={className}>
    <Icon name='Ex' styleName='close-messages-icon' />
  </Link>
}

export default CloseMessages
