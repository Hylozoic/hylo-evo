import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import './CloseMessages.scss'

function CloseMessages ({ onCloseURL }) {
  return <Link to={onCloseURL} styleName='close-messages'>
    <Icon name='ArrowForward' styleName='close-messages-icon' />
  </Link>
}

export default CloseMessages
