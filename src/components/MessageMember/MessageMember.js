import React from 'react'
import { Link } from 'react-router-dom'

import Button from 'components/Button'
import './MessageMember.scss'

export default function MessageMember ({ match }) {
  return <Link to={`/messages/new/${match.params.id}`}>
    <Button styleName='message-member'>Message</Button>
  </Link>
}
