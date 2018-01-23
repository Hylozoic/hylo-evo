import React from 'react'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import Button from 'components/Button'
import { messagesUrl } from 'utils/index'
import './MessageMember.scss'

export default function MessageMember ({ isMe, member }) {
  if (!member) return <Loading />
  const { messageThreadId } = member

  const path = messageThreadId
    ? `/t/${messageThreadId}`
    : `/t/new?participants=${member.id}`

  return <div styleName='container'>
    {isMe
      ? <Link to={messagesUrl()}>
        <Button styleName='message-member'>Messages</Button>
      </Link>
      : <Link to={path}>
        <Button styleName='message-member'>Message</Button>
      </Link>}
  </div>
}
