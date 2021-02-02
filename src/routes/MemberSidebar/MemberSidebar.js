import React from 'react'
import { get } from 'lodash/fp'
import { Link } from 'react-router-dom'
import { messagePersonUrl, messagesUrl, currentUserSettingsUrl } from 'util/navigation'
import Button from 'components/Button'
import './MemberSidebar.scss'

export default function MemberSidebar ({ member, currentUser }) {
  const isCurrentUser = get('id', member) === get('id', currentUser)

  return <div styleName='member-sidebar'>
    <div styleName='message-member-container'>
      <Link to={isCurrentUser ? messagesUrl() : messagePersonUrl(member)}>
        <Button>Messages</Button>
      </Link>
    </div>
    {isCurrentUser && <Link to={currentUserSettingsUrl()} styleName='sidebar-link'>
      Profile Settings
    </Link>}
  </div>
}
