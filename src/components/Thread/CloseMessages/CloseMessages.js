import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import './CloseMessages.scss'

function CloseMessages () {
  return <Link to='/' styleName='close-messages'>
    <Icon name='Ex' styleName='close-messages-icon' />
  </Link>
}

export default CloseMessages
