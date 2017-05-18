import React from 'react'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Button from 'components/Button'
import './MessageMember.scss'
import getParam from 'store/selectors/getParam'

export function MessageMember ({ id }) {
  return <div styleName='container'>
    <Link to={`/t/new?participants=${id}`}>
      <Button styleName='message-member'>Message</Button>
    </Link>
  </div>
}

export function mapStateToProps (state, props) {
  return {
    id: getParam('id', state, props)
  }
}

export default connect(mapStateToProps)(MessageMember)
