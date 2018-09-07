import React from 'react'
import Icon from 'components/Icon'
import './CloseMessages.scss'

function CloseMessages ({ goBack }) {
  return <a onClick={goBack} styleName='close-messages'>
    <Icon name='Ex' styleName='close-messages-icon' />
  </a>
}

export default CloseMessages
