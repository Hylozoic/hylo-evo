import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import './CloseMessages.scss'

function CloseMessages ({ onCloseLocation }) {
  return <Link to={onCloseLocation} styleName='close-messages'>
    <Icon name='ArrowForward' styleName='close-messages-icon' />
  </Link>
}

export default CloseMessages
