import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'

import Button from 'components/Button'
import './MessageMember.scss'

export function MessageMember ({ match, ready }) {
  if (!ready) return null

  return <div styleName='container'>
    <Link to={`/messages/new/${match.params.id}`}>
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
