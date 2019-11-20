import React from 'react'
import Button from 'components/Button'
import CloseMessages from '../CloseMessages'
import { newMessageUrl } from 'util/navigation'
import { Link } from 'react-router-dom'
import '../Messages.scss'

export default function Header ({ onCloseURL, smallScreen }) {
  return <div styleName='header'>
    {onCloseURL && <CloseMessages styleName='close-link' onCloseURL={onCloseURL} />}
    <div styleName='header-text'>Messages</div>
    <Link to={newMessageUrl()}>
      <Button label={smallScreen ? 'New' : 'New Message'} styleName='new-message' />
    </Link>
  </div>
}
