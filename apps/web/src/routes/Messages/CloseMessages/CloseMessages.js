import React from 'react'
import { Link } from 'react-router-dom'
import Icon from 'components/Icon'
import classes from './CloseMessages.module.scss'

function CloseMessages ({ onCloseLocation }) {
  return <Link to={onCloseLocation} className={classes.closeMessages}>
    <Icon name='ArrowForward' className={classes.closeMessagesIcon} />
  </Link>
}

export default CloseMessages
