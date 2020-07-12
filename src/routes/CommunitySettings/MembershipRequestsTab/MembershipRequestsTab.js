import PropTypes from 'prop-types'
import React, { Component } from 'react'
import styles from './MembershipRequestsTab.scss'

const { array, func, string } = PropTypes

export default class MembershipRequestsTab extends Component {
  static propTypes = {
    joinRequests: array,
    acceptJoinRequest: func,
    declineJoinRequest: func,
    slug: string
  }

  state = {
    modalVisible: false
  }

  componentDidMount () {
    const { communityId } = this.props
    this.props.fetchJoinRequests(communityId)
  }

  render () {
    return <React.Fragment>
      <div styleName='header'>
        <h2>People want to join your community!</h2>
        <span styleName='response-time'>Your average response time: 1 day</span>
      </div>
    </React.Fragment>
  }
}
