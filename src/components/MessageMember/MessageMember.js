import React from 'react'
import { Link } from 'react-router-dom'
import Loading from 'components/Loading'
import Button from 'components/Button'
import './MessageMember.scss'

export default function MessageMember ({ member }) {
  if (!member) return <Loading />
  const { messageThreadId } = member

  const path = messageThreadId
    ? `/t/${messageThreadId}`
    : `/t/new?participants=${member.id}`

  return <div styleName='container'>
    <Link to={path}>

      <Button styleName='message-member'>Message</Button>
    </Link>
  </div>
}
