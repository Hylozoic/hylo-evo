import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Button from 'components/Button'
import './MessageMember.scss'

export function MessageMember ({ member, ready, messageThreadId }) {
  if (!ready) return null

  console.log('member', member)

  const path = messageThreadId
    ? `/t/${messageThreadId}`
    : `/t/new?participants=${member.id}`

  return <div styleName='container'>
    <Link to={path}>
      <Button styleName='message-member'>Message</Button>
    </Link>
  </div>
}

export function mapStateToProps ({ MemberProfile }) {
  return {
    ready: MemberProfile.ready
  }
}

export default connect(mapStateToProps)(MessageMember)
